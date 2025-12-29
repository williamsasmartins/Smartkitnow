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
  const [inputs, setInputs] = useState({
    dpi: "", // Dots per inch (print)
    ppi: "", // Pixels per inch (display)
    widthInches: "", // Width in inches (print/display)
    heightInches: "", // Height in inches (print/display)
    pixelsWidth: "", // Pixels width (display)
    pixelsHeight: "", // Pixels height (display)
    mode: "dpi-to-pixels", // Calculation mode
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation logic:
   * Modes:
   * 1. dpi-to-pixels: Given DPI and physical size (width & height in inches), calculate pixels.
   * 2. pixels-to-dpi: Given pixels and physical size, calculate DPI.
   * 3. ppi-to-pixels: Given PPI and physical size, calculate pixels.
   * 4. pixels-to-ppi: Given pixels and physical size, calculate PPI.
   *
   * DPI and PPI are often used interchangeably but DPI is print resolution (dots per inch),
   * PPI is display resolution (pixels per inch).
   */

  const results = useMemo(() => {
    const dpi = parseFloat(inputs.dpi);
    const ppi = parseFloat(inputs.ppi);
    const widthInches = parseFloat(inputs.widthInches);
    const heightInches = parseFloat(inputs.heightInches);
    const pixelsWidth = parseInt(inputs.pixelsWidth);
    const pixelsHeight = parseInt(inputs.pixelsHeight);

    if (inputs.mode === "dpi-to-pixels") {
      if (!dpi || !widthInches || !heightInches) {
        return {
          primary: "—",
          secondary: "Pixels (WxH)",
          details: "Please enter DPI and physical dimensions (width and height in inches).",
          feedback: "",
        };
      }
      const pxWidth = Math.round(dpi * widthInches);
      const pxHeight = Math.round(dpi * heightInches);
      return {
        primary: `${pxWidth} × ${pxHeight}`,
        secondary: "Pixels (Width × Height)",
        details: `Pixels = DPI × Inches. Calculated as ${dpi} × ${widthInches} = ${pxWidth} (width), ${dpi} × ${heightInches} = ${pxHeight} (height).`,
        feedback: "Use these pixel dimensions for print image creation at specified DPI.",
      };
    }

    if (inputs.mode === "pixels-to-dpi") {
      if (!pixelsWidth || !pixelsHeight || !widthInches || !heightInches) {
        return {
          primary: "—",
          secondary: "DPI",
          details: "Please enter pixel dimensions and physical size in inches.",
          feedback: "",
        };
      }
      const dpiX = pixelsWidth / widthInches;
      const dpiY = pixelsHeight / heightInches;
      const dpiAvg = ((dpiX + dpiY) / 2).toFixed(2);
      return {
        primary: dpiAvg,
        secondary: "DPI (average)",
        details: `DPI = Pixels / Inches. Calculated as ${pixelsWidth} / ${widthInches} = ${dpiX.toFixed(
          2
        )} (width), ${pixelsHeight} / ${heightInches} = ${dpiY.toFixed(2)} (height).`,
        feedback: "This DPI value helps determine print quality from pixel dimensions.",
      };
    }

    if (inputs.mode === "ppi-to-pixels") {
      if (!ppi || !widthInches || !heightInches) {
        return {
          primary: "—",
          secondary: "Pixels (WxH)",
          details: "Please enter PPI and physical dimensions (width and height in inches).",
          feedback: "",
        };
      }
      const pxWidth = Math.round(ppi * widthInches);
      const pxHeight = Math.round(ppi * heightInches);
      return {
        primary: `${pxWidth} × ${pxHeight}`,
        secondary: "Pixels (Width × Height)",
        details: `Pixels = PPI × Inches. Calculated as ${ppi} × ${widthInches} = ${pxWidth} (width), ${ppi} × ${heightInches} = ${pxHeight} (height).`,
        feedback: "Use these pixel dimensions for display images at specified PPI.",
      };
    }

    if (inputs.mode === "pixels-to-ppi") {
      if (!pixelsWidth || !pixelsHeight || !widthInches || !heightInches) {
        return {
          primary: "—",
          secondary: "PPI",
          details: "Please enter pixel dimensions and physical size in inches.",
          feedback: "",
        };
      }
      const ppiX = pixelsWidth / widthInches;
      const ppiY = pixelsHeight / heightInches;
      const ppiAvg = ((ppiX + ppiY) / 2).toFixed(2);
      return {
        primary: ppiAvg,
        secondary: "PPI (average)",
        details: `PPI = Pixels / Inches. Calculated as ${pixelsWidth} / ${widthInches} = ${ppiX.toFixed(
          2
        )} (width), ${pixelsHeight} / ${heightInches} = ${ppiY.toFixed(2)} (height).`,
        feedback: "This PPI value helps determine display pixel density.",
      };
    }

    return {
      primary: "—",
      secondary: "",
      details: "Select a calculation mode and enter required inputs.",
      feedback: "",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between DPI and PPI?",
      answer:
        "DPI (Dots Per Inch) refers to the number of printed dots per inch in a physical print, affecting print quality. PPI (Pixels Per Inch) refers to the pixel density of a digital display or image, affecting screen sharpness. While often used interchangeably, DPI is print-specific and PPI is display-specific.",
    },
    {
      question: "How do I calculate pixels from DPI and physical size?",
      answer:
        "To calculate pixels from DPI and physical size, multiply the DPI value by the physical dimension in inches. For example, if your print is 8 inches wide at 300 DPI, the pixel width is 8 × 300 = 2400 pixels. Repeat for height to get total pixel dimensions.",
    },
    {
      question: "Can I use DPI values for digital displays?",
      answer:
        "No, DPI is a print resolution metric and does not directly apply to digital displays. For screens, use PPI (Pixels Per Inch) to measure pixel density. Using DPI for screens can cause confusion and inaccurate assumptions about image quality.",
    },
    {
      question: "Why do pixel dimensions sometimes not match physical size?",
      answer:
        "Pixel dimensions depend on resolution (DPI or PPI) and physical size. If resolution is low, pixel count is low, causing poor quality prints or displays. Conversely, high pixel dimensions with small physical size result in higher DPI/PPI and sharper images.",
    },
    {
      question: "How do I ensure my image prints at the correct size?",
      answer:
        "Ensure your image pixel dimensions correspond to the desired print size multiplied by the target DPI. For example, for a 10×8 inch print at 300 DPI, your image should be 3000×2400 pixels. This ensures sharp, accurate prints without scaling artifacts.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You want to print a photograph at 8×10 inches with a print resolution of 300 DPI. You need to calculate the pixel dimensions required for the image to print sharply.",
    steps: [
      {
        label: "Step 1",
        explanation: "Identify the physical print size: 8 inches (width) × 10 inches (height).",
      },
      {
        label: "Step 2",
        explanation: "Use the DPI value of 300 dots per inch for high-quality print.",
      },
      {
        label: "Step 3",
        explanation:
          "Calculate pixel width: 8 inches × 300 DPI = 2400 pixels. Calculate pixel height: 10 inches × 300 DPI = 3000 pixels.",
      },
      {
        label: "Step 4",
        explanation:
          "The image should be at least 2400×3000 pixels to print sharply at 8×10 inches with 300 DPI.",
      },
    ],
    result: "Required pixel dimensions: 2400 × 3000 pixels for an 8×10 inch print at 300 DPI.",
  };

  const references = [
    {
      title: "SMPTE Standards",
      description: "Timecode standards for video and broadcasting.",
      url: "https://www.smpte.org/",
    },
    {
      title: "Understanding DPI, PPI, and Image Resolution",
      description:
        "Comprehensive guide on the differences between DPI and PPI and how they affect image quality.",
      url: "https://www.cambridgeincolour.com/tutorials/dpi-pixels.htm",
    },
    {
      title: "Print Resolution and Image Size",
      description:
        "Explains how to calculate image size for printing based on DPI and physical dimensions.",
      url: "https://www.adobe.com/creativecloud/design/discover/dpi.html",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <select
          className="border rounded px-3 py-1 text-sm"
          value={inputs.mode}
          onChange={(e) => handleInputChange("mode", e.target.value)}
          aria-label="Select calculation mode"
        >
          <option value="dpi-to-pixels">DPI → Pixels (Print)</option>
          <option value="pixels-to-dpi">Pixels → DPI (Print)</option>
          <option value="ppi-to-pixels">PPI → Pixels (Display)</option>
          <option value="pixels-to-ppi">Pixels → PPI (Display)</option>
        </select>
      </div>

      {(inputs.mode === "dpi-to-pixels" || inputs.mode === "ppi-to-pixels") && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{inputs.mode === "dpi-to-pixels" ? "DPI (Dots Per Inch)" : "PPI (Pixels Per Inch)"}</Label>
              <Input
                type="number"
                min={1}
                step={1}
                value={inputs.mode === "dpi-to-pixels" ? inputs.dpi : inputs.ppi}
                onChange={(e) =>
                  inputs.mode === "dpi-to-pixels"
                    ? handleInputChange("dpi", e.target.value)
                    : handleInputChange("ppi", e.target.value)
                }
                placeholder="e.g. 300"
              />
            </div>
            <div className="space-y-2">
              <Label>Width (inches)</Label>
              <Input
                type="number"
                min={0.01}
                step={0.01}
                value={inputs.widthInches}
                onChange={(e) => handleInputChange("widthInches", e.target.value)}
                placeholder="e.g. 8"
              />
            </div>
            <div className="space-y-2">
              <Label>Height (inches)</Label>
              <Input
                type="number"
                min={0.01}
                step={0.01}
                value={inputs.heightInches}
                onChange={(e) => handleInputChange("heightInches", e.target.value)}
                placeholder="e.g. 10"
              />
            </div>
          </div>
        </>
      )}

      {(inputs.mode === "pixels-to-dpi" || inputs.mode === "pixels-to-ppi") && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Pixels Width</Label>
              <Input
                type="number"
                min={1}
                step={1}
                value={inputs.pixelsWidth}
                onChange={(e) => handleInputChange("pixelsWidth", e.target.value)}
                placeholder="e.g. 2400"
              />
            </div>
            <div className="space-y-2">
              <Label>Pixels Height</Label>
              <Input
                type="number"
                min={1}
                step={1}
                value={inputs.pixelsHeight}
                onChange={(e) => handleInputChange("pixelsHeight", e.target.value)}
                placeholder="e.g. 3000"
              />
            </div>
            <div className="space-y-2">
              <Label>Width (inches)</Label>
              <Input
                type="number"
                min={0.01}
                step={0.01}
                value={inputs.widthInches}
                onChange={(e) => handleInputChange("widthInches", e.target.value)}
                placeholder="e.g. 8"
              />
            </div>
            <div className="space-y-2">
              <Label>Height (inches)</Label>
              <Input
                type="number"
                min={0.01}
                step={0.01}
                value={inputs.heightInches}
                onChange={(e) => handleInputChange("heightInches", e.target.value)}
                placeholder="e.g. 10"
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
            <Separator className="my-3" />
            <p className="text-sm text-blue-700 font-semibold">{results.feedback}</p>
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
            Select the calculation mode from the dropdown: DPI to Pixels, Pixels to DPI, PPI to Pixels, or Pixels to PPI.
          </li>
          <li>
            Enter the required inputs based on the selected mode. For DPI/PPI to Pixels, input resolution and physical size in inches.
          </li>
          <li>
            For Pixels to DPI/PPI, input pixel dimensions and physical size in inches.
          </li>
          <li>Click the Calculate button to see the results displayed below.</li>
          <li>Use the results to prepare images for print or display with accurate resolution and size.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to DPI/PPI ↔ Pixels (Print/Display)
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            DPI (Dots Per Inch) and PPI (Pixels Per Inch) are critical concepts in video production, print, and display technologies. DPI is primarily used in printing to describe the number of ink dots per inch on a physical medium, directly impacting print clarity and detail. PPI, on the other hand, refers to the pixel density of digital displays or images, influencing screen sharpness and image quality.
          </p>
          <p>
            Understanding how to convert between DPI/PPI and pixel dimensions is essential for professionals working in video engineering, digital imaging, and print production. The pixel dimension of an image is a product of its physical size multiplied by the resolution (DPI or PPI). For example, an 8-inch wide print at 300 DPI requires an image width of 2400 pixels (8 × 300).
          </p>
          <p>
            When preparing images for print, it is important to use DPI to ensure the image will print sharply without pixelation. Conversely, for digital displays, PPI is used to understand how many pixels fit into an inch of screen space, affecting perceived image quality. Confusing these terms or using incorrect values can lead to poor print quality or blurry displays.
          </p>
          <p>
            This calculator helps you accurately convert between DPI/PPI and pixel dimensions by allowing you to input either resolution and physical size or pixel dimensions and physical size. It supports both print and display workflows, ensuring your images are optimized for their intended medium.
          </p>
          <p>
            Always remember that 8 bits equal 1 byte when dealing with image file sizes, and that SMPTE standards govern timecode formats in video production, which is crucial for synchronization but outside the scope of this calculator.
          </p>
        </div>
      </section>

      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
          <p>
            <strong>Warning:</strong> Confusing DPI and PPI can lead to incorrect image sizing and poor quality output. DPI applies to print resolution, while PPI applies to digital displays. Using DPI values for screen images or PPI for print can cause unexpected results.
          </p>
          <p>
            <strong>Warning:</strong> Not entering physical dimensions in inches or mixing units (e.g., centimeters) without conversion will produce inaccurate pixel calculations. Always use inches for DPI/PPI calculations.
          </p>
          <p>
            <strong>Warning:</strong> Ignoring aspect ratio when calculating pixels or DPI/PPI can distort images. Ensure width and height inputs correspond correctly to maintain image proportions.
          </p>
          <p>
            <strong>Warning:</strong> Assuming higher DPI/PPI always means better quality without considering viewing distance or print medium can waste resources and cause unnecessarily large files.
          </p>
          <p>
            <strong>Warning:</strong> Forgetting that 8 bits = 1 byte when calculating file sizes or bandwidth can cause errors in data rate estimations.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="prose prose-slate dark:prose-invert">
          <p><strong>Scenario:</strong> {example.scenario}</p>
          {example.steps.map((step, i) => (
            <p key={i}>
              <strong>{step.label}:</strong> {step.explanation}
            </p>
          ))}
          <p><strong>Result:</strong> {example.result}</p>
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
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}