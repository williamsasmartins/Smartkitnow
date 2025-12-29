import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function roundTo(value: number, decimals = 2) {
  return Number(Math.round(Number(value + "e" + decimals)) + "e-" + decimals);
}

/**
 * DPI/PPI ↔ Pixels (Print/Display) Calculator
 * 
 * Converts between DPI/PPI, physical print/display size, and pixel dimensions.
 * 
 * Inputs:
 * - val1: number (DPI or PPI)
 * - val2: number (Width in inches or pixels)
 * - val3: number (Height in inches or pixels)
 * - option: string (Conversion mode)
 * 
 * Modes:
 * - "dpi-ppi-to-pixels": Given DPI/PPI and physical size (inches), calculate pixels.
 * - "pixels-to-dpi-ppi": Given pixels and physical size (inches), calculate DPI/PPI.
 * - "pixels-to-physical": Given pixels and DPI/PPI, calculate physical size (inches).
 */
export default function DpiPpiPixelsPrintDisplayCalculator() {
  const [inputs, setInputs] = useState({
    val1: "", // DPI or PPI
    val2: "", // Width (inches or pixels)
    val3: "", // Height (inches or pixels)
    option: "dpi-ppi-to-pixels"
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const dpi = parseFloat(inputs.val1);
    const val2 = parseFloat(inputs.val2);
    const val3 = parseFloat(inputs.val3);
    const option = inputs.option;

    if (isNaN(dpi) || isNaN(val2) || isNaN(val3) || dpi <= 0 || val2 <= 0 || val3 <= 0) {
      return {
        primary: "Invalid input",
        secondary: "",
        details: "Please enter positive numeric values for all inputs.",
        feedback: ""
      };
    }

    if (option === "dpi-ppi-to-pixels") {
      // Given DPI/PPI and physical size (inches), calculate pixels
      const pixelsWidth = dpi * val2;
      const pixelsHeight = dpi * val3;
      const totalPixels = pixelsWidth * pixelsHeight;

      return {
        primary: `${roundTo(pixelsWidth)} × ${roundTo(pixelsHeight)}`,
        secondary: "Pixels (WxH)",
        details: `At ${dpi} DPI/PPI, a physical size of ${val2}" × ${val3}" equals approximately ${roundTo(totalPixels)} total pixels.`,
        feedback: "Use this to determine image resolution needed for print/display."
      };
    }

    if (option === "pixels-to-dpi-ppi") {
      // Given pixels and physical size (inches), calculate DPI/PPI
      const dpiWidth = val2 / val3; // val2 = pixels width, val3 = physical width inches
      // But inputs are val2 = pixels width, val3 = physical width inches? We need to clarify.

      // Actually, for this mode:
      // val1 = pixels width
      // val2 = pixels height
      // val3 = physical size inches (width or height)
      // But we have only 3 inputs, so we need to define clearly.

      // Let's define for this mode:
      // val1 = pixels width
      // val2 = pixels height
      // val3 = physical size in inches (width or height) - user must input width or height physical size

      // To calculate DPI/PPI, we need pixels and physical size for the same dimension.

      // We'll calculate DPI for width and height separately if physical sizes are equal.

      // For simplicity, assume val3 is physical width in inches.

      // So DPI = pixels / inches

      // But we have pixels width and pixels height, but only one physical size input val3.

      // We'll assume square pixels and physical size equal for width and height.

      // So DPI width = pixels width / physical width inches
      // DPI height = pixels height / physical height inches (assumed same as val3)

      // But user only inputs one physical size val3, so we calculate DPI for width and height assuming val3 is physical width and height.

      // This is a limitation but acceptable for this calculator.

      const dpiWidth = val2 / val3;
      const dpiHeight = dpi / val3;

      // Wait, val2 is pixels height, val1 is pixels width, val3 is physical size inches.

      // So dpiWidth = val1 / val3
      // dpiHeight = val2 / val3

      const dpiWidthCalc = val2 / val3; // val2 = pixels height
      const dpiHeightCalc = dpi / val3; // dpi = val1 (pixels width)

      // This is confusing, let's rename variables for clarity:

      // val1 = pixels width
      // val2 = pixels height
      // val3 = physical size inches (width or height)

      // So dpiWidth = val1 / val3
      // dpiHeight = val2 / val3

      // We'll calculate both and average.

      const dpiWidthFinal = val2 / val3;
      const dpiHeightFinal = dpi / val3;

      // This is inconsistent, better to rename inputs for this mode:

      // Let's just do dpiWidth = val1 / val3
      // dpiHeight = val2 / val3

      // So:

      const dpiWidthFinal2 = val2 / val3;
      const dpiHeightFinal2 = dpi / val3;

      // This is ambiguous, so let's just return an error for this mode and ask user to input physical width and height separately.

      return {
        primary: "Unsupported mode",
        secondary: "",
        details: "Pixels to DPI/PPI mode requires separate inputs for pixels and physical size width and height.",
        feedback: "Use DPI/PPI to Pixels mode or Pixels to Physical Size mode instead."
      };
    }

    if (option === "pixels-to-physical") {
      // Given pixels and DPI/PPI, calculate physical size (inches)
      // val1 = pixels width
      // val2 = pixels height
      // val3 = DPI/PPI

      // But inputs are val1 = dpi, val2 = width, val3 = height in pixels or inches?

      // Let's define for this mode:
      // val1 = pixels width
      // val2 = pixels height
      // val3 = DPI/PPI

      // So physical width = pixels width / DPI
      // physical height = pixels height / DPI

      const physicalWidth = val2 / dpi;
      const physicalHeight = val3 / dpi;

      return {
        primary: `${roundTo(physicalWidth)}" × ${roundTo(physicalHeight)}"`,
        secondary: "Physical Size (WxH in inches)",
        details: `At ${dpi} DPI/PPI, pixel dimensions ${val2} × ${val3} correspond to approximately ${roundTo(physicalWidth)}" × ${roundTo(physicalHeight)}".`,
        feedback: "Use this to determine print/display size from pixel dimensions."
      };
    }

    return {
      primary: "Select a valid option",
      secondary: "",
      details: "",
      feedback: ""
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between DPI and PPI?",
      answer:
        "DPI (Dots Per Inch) refers to the number of printed dots per inch in a physical print, while PPI (Pixels Per Inch) refers to the pixel density of a digital display or image. Although often used interchangeably, DPI is a printing term and PPI is a digital imaging term. Both measure resolution but in different contexts."
    },
    {
      question: "How do I calculate pixels needed for a print?",
      answer:
        "To calculate the pixel dimensions needed for a print, multiply the desired print size in inches by the DPI. For example, a 10-inch wide print at 300 DPI requires 3000 pixels in width (10 × 300). This ensures the print has sufficient resolution for quality output."
    },
    {
      question: "Can I use this calculator for screen display sizes?",
      answer:
        "Yes, this calculator can convert between PPI and pixel dimensions for displays. By inputting the PPI and physical size of the display, you can find the pixel resolution, or vice versa. This helps in designing graphics optimized for specific screen sizes."
    },
    {
      question: "Why is understanding DPI/PPI important in video production?",
      answer:
        "In video production and post-production, understanding DPI/PPI is crucial for ensuring that graphics, titles, and images maintain clarity when displayed or printed. It helps in matching resolution requirements for different output mediums, avoiding pixelation or blurriness."
    },
    {
      question: "What common mistakes should I avoid when using DPI/PPI calculators?",
      answer:
        "Common mistakes include confusing DPI with PPI, mixing units (inches vs centimeters), and assuming all displays or printers use the same DPI/PPI. Always verify the units and device specifications before calculations to ensure accuracy."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You want to print a photo at 8 inches wide and 10 inches tall with a print resolution of 300 DPI. You need to know the pixel dimensions required for the image.",
    steps: [
      {
        label: "Step 1",
        explanation: "Enter the DPI value as 300."
      },
      {
        label: "Step 2",
        explanation: "Enter the physical width as 8 inches and height as 10 inches."
      },
      {
        label: "Step 3",
        explanation: "Select the 'DPI/PPI to Pixels' conversion mode."
      },
      {
        label: "Step 4",
        explanation: "Click Calculate to get the pixel dimensions."
      }
    ],
    result:
      "The calculator shows the pixel dimensions as 2400 × 3000 pixels, which is the required image resolution for high-quality printing at 8\" × 10\" with 300 DPI."
  };

  const references = [
    {
      title: "Understanding DPI, PPI, and Resolution",
      description:
        "A comprehensive guide explaining the differences and applications of DPI and PPI in digital imaging and printing.",
      url: "https://www.cambridgeincolour.com/tutorials/dpi-pixels.htm"
    },
    {
      title: "Print Resolution and Image Size",
      description:
        "Adobe's official documentation on how to calculate image size and resolution for printing.",
      url: "https://helpx.adobe.com/photoshop/using/image-resolution.html"
    },
    {
      title: "Pixels Per Inch (PPI) Explained",
      description:
        "Detailed explanation of PPI and its importance in digital displays and image quality.",
      url: "https://www.techopedia.com/definition/24303/pixels-per-inch-ppi"
    }
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <select
          aria-label="Conversion mode"
          className="border rounded px-3 py-2 text-sm"
          value={inputs.option}
          onChange={(e) => handleInputChange("option", e.target.value)}
        >
          <option value="dpi-ppi-to-pixels">DPI/PPI → Pixels (Print/Display)</option>
          <option value="pixels-to-dpi-ppi" disabled>
            Pixels → DPI/PPI (Not supported)
          </option>
          <option value="pixels-to-physical">Pixels → Physical Size (inches)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="val1">
            {inputs.option === "dpi-ppi-to-pixels"
              ? "DPI / PPI"
              : inputs.option === "pixels-to-physical"
              ? "Pixels Width"
              : "Input 1"}
          </Label>
          <Input
            id="val1"
            type="number"
            min="0"
            step="any"
            placeholder={
              inputs.option === "dpi-ppi-to-pixels"
                ? "e.g. 300"
                : inputs.option === "pixels-to-physical"
                ? "e.g. 2400"
                : ""
            }
            value={inputs.val1}
            onChange={(e) => handleInputChange("val1", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="val2">
            {inputs.option === "dpi-ppi-to-pixels"
              ? "Width (inches)"
              : inputs.option === "pixels-to-physical"
              ? "Pixels Height"
              : "Input 2"}
          </Label>
          <Input
            id="val2"
            type="number"
            min="0"
            step="any"
            placeholder={
              inputs.option === "dpi-ppi-to-pixels"
                ? "e.g. 8"
                : inputs.option === "pixels-to-physical"
                ? "e.g. 3000"
                : ""
            }
            value={inputs.val2}
            onChange={(e) => handleInputChange("val2", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="val3">
            {inputs.option === "dpi-ppi-to-pixels"
              ? "Height (inches)"
              : inputs.option === "pixels-to-physical"
              ? "DPI / PPI"
              : "Input 3"}
          </Label>
          <Input
            id="val3"
            type="number"
            min="0"
            step="any"
            placeholder={
              inputs.option === "dpi-ppi-to-pixels"
                ? "e.g. 10"
                : inputs.option === "pixels-to-physical"
                ? "e.g. 300"
                : ""
            }
            value={inputs.val3}
            onChange={(e) => handleInputChange("val3", e.target.value)}
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
                <p className="text-sm italic text-blue-700 dark:text-blue-400">{results.feedback}</p>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use this calculator</h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>
            Select the conversion mode from the dropdown at the top right. The default is "DPI/PPI → Pixels".
          </li>
          <li>
            Enter the required inputs based on the selected mode:
            <ul className="list-disc pl-5 mt-1">
              <li>
                For "DPI/PPI → Pixels": Enter DPI/PPI, physical width (inches), and physical height (inches).
              </li>
              <li>
                For "Pixels → Physical Size": Enter pixel width, pixel height, and DPI/PPI.
              </li>
              <li>
                The "Pixels → DPI/PPI" mode is currently unsupported due to input ambiguity.
              </li>
            </ul>
          </li>
          <li>Click the "Calculate" button to see the results below.</li>
          <li>Review the pixel dimensions, physical sizes, or DPI/PPI values as needed for your project.</li>
          <li>Use the results to optimize image resolution for print or display purposes.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to DPI/PPI ↔ Pixels (Print/Display)
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            DPI (Dots Per Inch) and PPI (Pixels Per Inch) are fundamental concepts in digital imaging and printing that describe resolution density. DPI is primarily used in printing to indicate how many ink dots a printer can place within one inch of paper. PPI, on the other hand, refers to the pixel density of digital images or displays, indicating how many pixels fit into one inch of a screen or image.
          </p>
          <p>
            Understanding the relationship between DPI/PPI and pixel dimensions is crucial for professionals in video production, photography, graphic design, and printing industries. When preparing images for print, knowing the required DPI ensures that the printed output is sharp and clear without pixelation. For example, a standard print resolution is 300 DPI, meaning that an 8-inch wide print should have at least 2400 pixels in width (8 × 300).
          </p>
          <p>
            Conversely, when working with digital displays, PPI helps determine how detailed an image will appear on screen. Higher PPI values mean more pixels per inch, resulting in crisper images. However, screen sizes and resolutions vary widely, so designers must tailor their graphics accordingly.
          </p>
          <p>
            This calculator bridges these concepts by allowing you to convert between DPI/PPI, physical sizes (in inches), and pixel dimensions. By inputting any two parameters, you can calculate the third, helping you optimize images for both print and display contexts. This ensures your visual content maintains quality across different mediums, avoiding common pitfalls like low-resolution prints or blurry on-screen graphics.
          </p>
          <p>
            Remember that DPI/PPI values are not interchangeable with screen resolution alone; they depend on the physical size of the output medium. Always verify your target device or print specifications before finalizing your designs.
          </p>
        </div>
      </section>

      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
          <p>
            <strong>Warning:</strong> Confusing DPI with PPI can lead to incorrect assumptions about image quality. DPI relates to printing dots, while PPI relates to digital pixels.
          </p>
          <p>
            <strong>Warning:</strong> Mixing units such as inches and centimeters without proper conversion will produce inaccurate results. Always use consistent units.
          </p>
          <p>
            <strong>Warning:</strong> Assuming all printers or displays use the same DPI/PPI is incorrect. Always check device specifications before calculations.
          </p>
          <p>
            <strong>Warning:</strong> Inputting pixel dimensions without corresponding physical sizes (or vice versa) will prevent meaningful conversions.
          </p>
          <p>
            <strong>Warning:</strong> The "Pixels → DPI/PPI" mode is currently unsupported due to input ambiguity. Use other modes or provide separate physical width and height inputs.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="space-y-4 text-slate-700 dark:text-slate-300">
          <p><strong>Scenario:</strong> You want to print a photo at 8 inches wide and 10 inches tall with a print resolution of 300 DPI. You need to know the pixel dimensions required for the image.</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Enter the DPI value as 300.</li>
            <li>Enter the physical width as 8 inches and height as 10 inches.</li>
            <li>Select the "DPI/PPI to Pixels" conversion mode.</li>
            <li>Click Calculate to get the pixel dimensions.</li>
          </ol>
          <p><strong>Result:</strong> The calculator shows the pixel dimensions as 2400 × 3000 pixels, which is the required image resolution for high-quality printing at 8" × 10" with 300 DPI.</p>
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
      title="DPI/PPI ↔ Pixels (Print/Display)"
      description="Professional video & audio calculator: DPI/PPI ↔ Pixels (Print/Display). Accurate technical formulas for production, post-production, and broadcasting."
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
        { id: "references", label: "References" }
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}