import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DpiPpiPixelsPrintDisplayCalculator() {
  /**
   * Inputs:
   * val1: DPI or PPI (dots or pixels per inch)
   * val2: Width or Height in inches (print/display physical size)
   * val3: Pixels (optional, to calculate DPI/PPI from pixels and inches)
   * option: "dpi-to-pixels" or "pixels-to-dpi"
   * 
   * Logic:
   * DPI/PPI × inches = pixels (rounded)
   * pixels ÷ inches = DPI/PPI
   * 
   * Note: DPI (dots per inch) is print resolution, PPI (pixels per inch) is display resolution.
   * They are numerically equivalent for calculation purposes here.
   */

  const [inputs, setInputs] = useState({
    val1: "", // DPI or Pixels depending on option
    val2: "", // Inches (width or height)
    val3: "", // Pixels or DPI depending on option
    option: "dpi-to-pixels"
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const dpiOrPpi = parseFloat(inputs.val1);
    const inches = parseFloat(inputs.val2);
    const pixels = parseFloat(inputs.val3);

    if (inputs.option === "dpi-to-pixels") {
      // Calculate pixels from DPI/PPI and inches
      if (isNaN(dpiOrPpi) || isNaN(inches) || dpiOrPpi <= 0 || inches <= 0) {
        return {
          primary: "Invalid input",
          secondary: "",
          details: "Please enter positive numbers for DPI/PPI and inches.",
          feedback: ""
        };
      }
      const calculatedPixels = dpiOrPpi * inches;
      return {
        primary: Math.round(calculatedPixels).toLocaleString(),
        secondary: "Pixels",
        details: `${dpiOrPpi} DPI/PPI × ${inches} inches = ${calculatedPixels.toFixed(2)} pixels`,
        feedback:
          "Use this pixel count to set your image or display resolution for optimal print or screen quality."
      };
    } else if (inputs.option === "pixels-to-dpi") {
      // Calculate DPI/PPI from pixels and inches
      if (isNaN(pixels) || isNaN(inches) || pixels <= 0 || inches <= 0) {
        return {
          primary: "Invalid input",
          secondary: "",
          details: "Please enter positive numbers for pixels and inches.",
          feedback: ""
        };
      }
      const calculatedDpi = pixels / inches;
      return {
        primary: calculatedDpi.toFixed(2),
        secondary: "DPI/PPI",
        details: `${pixels} pixels ÷ ${inches} inches = ${calculatedDpi.toFixed(2)} DPI/PPI`,
        feedback:
          "This DPI/PPI value helps determine print quality or display sharpness based on pixel density."
      };
    }

    return {
      primary: "Select calculation type",
      secondary: "",
      details: "",
      feedback: ""
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between DPI and PPI?",
      answer:
        "DPI (dots per inch) refers to the number of printed dots per inch in a physical print, while PPI (pixels per inch) refers to the pixel density of a digital display or image. Although numerically similar, DPI is a print term and PPI is a digital term. This calculator treats them equivalently for resolution calculations."
    },
    {
      question: "Why is DPI/PPI important for print and display?",
      answer:
        "DPI/PPI determines the sharpness and clarity of an image when printed or displayed. Higher DPI/PPI means more detail and smoother edges. For print, 300 DPI is considered high quality, while displays vary widely from 72 PPI (standard monitors) to over 400 PPI (retina displays)."
    },
    {
      question: "Can I convert pixels directly to inches?",
      answer:
        "Pixels alone do not have a physical size until you know the DPI/PPI or the physical size in inches. To convert pixels to inches, you need either the DPI/PPI or the physical dimension. This calculator helps you find the missing value when two are known."
    },
    {
      question: "What happens if I use a low DPI for printing?",
      answer:
        "Using a low DPI (e.g., 72 DPI) for printing usually results in pixelated or blurry prints because there are not enough dots per inch to represent the image detail. For high-quality prints, 300 DPI or higher is recommended."
    },
    {
      question: "How does this calculator relate to video and broadcasting?",
      answer:
        "While DPI/PPI is primarily a print and display concept, understanding pixel density is crucial in video production and broadcasting for ensuring images and graphics appear sharp on various screens and print materials. This calculator helps professionals convert and verify resolutions accurately."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have a print image that is 8 inches wide and you want to print it at 300 DPI. How many pixels wide should the image be?",
    steps: [
      {
        label: "Step 1",
        explanation: "Select 'DPI to Pixels' calculation mode."
      },
      {
        label: "Step 2",
        explanation: "Enter DPI as 300 and width in inches as 8."
      },
      {
        label: "Step 3",
        explanation: "Calculate to find pixels: 300 × 8 = 2400 pixels."
      }
    ],
    result:
      "You need an image width of 2400 pixels to print at 300 DPI on an 8-inch wide print for optimal quality."
  };

  const references = [
    {
      title: "Understanding DPI, PPI, and Resolution",
      description:
        "A comprehensive guide explaining the difference between DPI and PPI and their importance in digital and print media.",
      url: "https://www.cambridgeincolour.com/tutorials/dpi-pixels.htm"
    },
    {
      title: "Print Resolution and Image Quality",
      description:
        "Adobe's official documentation on how resolution affects print quality and how to prepare images for printing.",
      url: "https://helpx.adobe.com/photoshop/using/image-resolution.html"
    },
    {
      title: "Pixel Density and Display Resolution",
      description:
        "An article explaining pixel density concepts and how they affect display sharpness and user experience.",
      url: "https://www.displaymate.com/PixelDensity_ShootOut_1.htm"
    }
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-center mb-4">
        <select
          aria-label="Select calculation type"
          className="border rounded px-3 py-2 text-lg"
          value={inputs.option}
          onChange={(e) => handleInputChange("option", e.target.value)}
        >
          <option value="dpi-to-pixels">DPI/PPI → Pixels</option>
          <option value="pixels-to-dpi">Pixels → DPI/PPI</option>
        </select>
      </div>

      {inputs.option === "dpi-to-pixels" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dpiInput">DPI / PPI</Label>
              <Input
                id="dpiInput"
                type="number"
                min="1"
                step="any"
                placeholder="e.g. 300"
                value={inputs.val1}
                onChange={(e) => handleInputChange("val1", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inchInput">Width or Height (inches)</Label>
              <Input
                id="inchInput"
                type="number"
                min="0.01"
                step="any"
                placeholder="e.g. 8"
                value={inputs.val2}
                onChange={(e) => handleInputChange("val2", e.target.value)}
              />
            </div>
          </div>
        </>
      )}

      {inputs.option === "pixels-to-dpi" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pixelsInput">Pixels</Label>
              <Input
                id="pixelsInput"
                type="number"
                min="1"
                step="any"
                placeholder="e.g. 2400"
                value={inputs.val3}
                onChange={(e) => handleInputChange("val3", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inchInput2">Width or Height (inches)</Label>
              <Input
                id="inchInput2"
                type="number"
                min="0.01"
                step="any"
                placeholder="e.g. 8"
                value={inputs.val2}
                onChange={(e) => handleInputChange("val2", e.target.value)}
              />
            </div>
          </div>
        </>
      )}

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
            {results.feedback && <Separator className="my-4" />}
            {results.feedback && <p className="text-sm text-slate-700 dark:text-slate-300">{results.feedback}</p>}
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
          <li>Select the calculation mode: "DPI/PPI → Pixels" to find pixel dimensions from resolution and size, or "Pixels → DPI/PPI" to find resolution from pixel count and size.</li>
          <li>Enter the known values in the input fields. For DPI/PPI → Pixels, input DPI/PPI and physical size in inches. For Pixels → DPI/PPI, input pixel count and physical size in inches.</li>
          <li>Click the "Calculate" button to see the result displayed below the inputs.</li>
          <li>Use the result to set your image resolution for printing or display purposes accurately.</li>
          <li>Refer to the guide and FAQs for deeper understanding and best practices.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to DPI/PPI ↔ Pixels (Print/Display)
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            DPI (dots per inch) and PPI (pixels per inch) are fundamental concepts in both print and digital imaging, representing the density of dots or pixels within a linear inch. While DPI is traditionally used in printing to describe how many ink dots a printer can place in an inch, PPI is used in digital displays to describe pixel density. Despite their contextual differences, both values numerically describe resolution and are interchangeable in calculations involving physical size and pixel count.
          </p>
          <p>
            This calculator helps professionals in video engineering, digital imaging, and print production convert between DPI/PPI, physical size in inches, and pixel dimensions. For example, if you know the desired print size and the DPI, you can calculate the exact pixel dimensions your image must have to print sharply without pixelation. Conversely, if you have an image with a known pixel dimension and want to print it at a specific size, you can calculate the effective DPI to understand the print quality.
          </p>
          <p>
            Understanding these relationships is crucial in production and post-production workflows to ensure that images and videos maintain their intended quality across different media. For instance, a video frame intended for broadcast might need to be converted to a print poster; knowing how to convert pixel dimensions to DPI and inches ensures the final print is crisp and professional. Similarly, digital displays with varying PPI values require graphics to be created at appropriate resolutions to avoid blurriness or pixelation.
          </p>
          <p>
            This calculator uses simple but precise formulas: pixels = DPI × inches, and DPI = pixels ÷ inches. It assumes linear scaling and does not account for interpolation or resampling artifacts, which should be considered in practical workflows. By using this tool, professionals can optimize image and video assets for their target media, saving time and avoiding costly quality issues.
          </p>
        </div>
      </section>

      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
          <p>
            <strong>Warning:</strong> Confusing DPI and PPI can lead to incorrect assumptions about image quality. Remember that DPI is a print term and PPI is a digital display term, though numerically equivalent for calculations.
          </p>
          <p>
            <strong>Warning:</strong> Using pixel dimensions without considering physical size or DPI/PPI results in images that may appear blurry or pixelated when printed or displayed.
          </p>
          <p>
            <strong>Warning:</strong> Entering zero or negative values for DPI, pixels, or inches will produce invalid results. Always use positive numbers.
          </p>
          <p>
            <strong>Warning:</strong> Assuming all displays have the same PPI can cause graphics to appear differently on various devices. Always check target device specifications.
          </p>
          <p>
            <strong>Warning:</strong> Ignoring the aspect ratio when calculating pixel dimensions can distort images. Ensure width and height are calculated consistently.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="prose prose-slate dark:prose-invert">
          <p><strong>Scenario:</strong> You have a print image that is 8 inches wide and you want to print it at 300 DPI. How many pixels wide should the image be?</p>
          <ol>
            <li><strong>Step 1:</strong> Select "DPI to Pixels" calculation mode.</li>
            <li><strong>Step 2:</strong> Enter DPI as 300 and width in inches as 8.</li>
            <li><strong>Step 3:</strong> Calculate to find pixels: 300 × 8 = 2400 pixels.</li>
          </ol>
          <p><strong>Result:</strong> You need an image width of 2400 pixels to print at 300 DPI on an 8-inch wide print for optimal quality.</p>
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