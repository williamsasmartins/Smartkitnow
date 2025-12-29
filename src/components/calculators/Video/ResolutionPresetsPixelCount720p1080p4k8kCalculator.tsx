import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function gcd(a: number, b: number): number {
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

function simplifyRatio(width: number, height: number) {
  const divisor = gcd(width, height);
  return [width / divisor, height / divisor];
}

export default function ResolutionPresetsPixelCount720p1080p4k8kCalculator() {
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

  const results = useMemo(() => {
    const width = parseFloat(inputs.width);
    const height = parseFloat(inputs.height);
    const diagonal = parseFloat(inputs.diagonal);

    if ((!width && !height && !diagonal) || (width < 0 || height < 0 || diagonal < 0)) {
      return {
        primary: "0",
        secondary: "Pixels",
        details: "Please enter valid positive numbers for Width, Height, or Diagonal.",
        feedback: "",
      };
    }

    // Preset resolutions for reference
    const presets = {
      "720p": { width: 1280, height: 720 },
      "1080p": { width: 1920, height: 1080 },
      "4K UHD": { width: 3840, height: 2160 },
      "8K UHD": { width: 7680, height: 4320 },
    };

    // Calculate pixel count if width and height are given
    if (width && height) {
      const pixelCount = Math.round(width * height);
      const [ratioW, ratioH] = simplifyRatio(width, height);
      // Find closest preset by resolution area difference
      let closestPreset = "";
      let closestDiff = Infinity;
      Object.entries(presets).forEach(([key, val]) => {
        const presetPixels = val.width * val.height;
        const diff = Math.abs(presetPixels - pixelCount);
        if (diff < closestDiff) {
          closestDiff = diff;
          closestPreset = key;
        }
      });

      return {
        primary: pixelCount.toLocaleString(),
        secondary: "Pixels",
        details: `Resolution ratio simplified: ${ratioW}:${ratioH}. Closest standard preset: ${closestPreset} (${presets[closestPreset].width}x${presets[closestPreset].height}).`,
        feedback: "Use standard presets for compatibility and optimized workflows.",
      };
    }

    // Calculate width and height if diagonal and ratio are given
    if (diagonal && width && !height) {
      // Assume width is ratio width, calculate height by ratio and diagonal
      // Use ratio from width input as ratio width, height unknown
      // This is ambiguous without ratio height, so fallback to error
      return {
        primary: "0",
        secondary: "Pixels",
        details: "Please provide both Width and Height or Width and Height ratio with Diagonal.",
        feedback: "",
      };
    }

    if (diagonal && height && !width) {
      return {
        primary: "0",
        secondary: "Pixels",
        details: "Please provide both Width and Height or Width and Height ratio with Diagonal.",
        feedback: "",
      };
    }

    if (diagonal && width && height) {
      // Calculate pixel count from width and height ratio + diagonal
      // First, calculate ratio diagonal in pixels
      const ratioDiagonal = Math.sqrt(width * width + height * height);
      // Calculate scale factor for actual diagonal
      const scale = diagonal / ratioDiagonal;
      // Calculate actual width and height in pixels
      const actualWidth = width * scale;
      const actualHeight = height * scale;
      const pixelCount = Math.round(actualWidth * actualHeight);
      const [ratioW, ratioH] = simplifyRatio(width, height);

      return {
        primary: pixelCount.toLocaleString(),
        secondary: "Pixels",
        details: `Diagonal: ${diagonal}" with ratio ${ratioW}:${ratioH} results in approx. ${Math.round(actualWidth)}x${Math.round(actualHeight)} resolution.`,
        feedback: "Ensure your input ratio matches your display or sensor aspect ratio for accurate results.",
      };
    }

    return {
      primary: "0",
      secondary: "Pixels",
      details: "Please enter Width and Height to calculate pixel count.",
      feedback: "",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between resolution and pixel count?",
      answer:
        "Resolution refers to the dimensions of an image or video frame, typically expressed as width x height (e.g., 1920x1080). Pixel count is the total number of pixels in that frame, calculated by multiplying width by height. Higher pixel counts generally mean more detail but require more processing power and storage.",
    },
    {
      question: "Why is aspect ratio important when calculating resolution?",
      answer:
        "Aspect ratio defines the proportional relationship between width and height of an image or screen. Maintaining the correct aspect ratio ensures that images and videos are displayed without distortion. When calculating resolution from diagonal size, the aspect ratio is essential to determine the correct width and height values.",
    },
    {
      question: "Can I calculate resolution if I only know the diagonal size?",
      answer:
        "Yes, but you must also know the aspect ratio (width to height ratio) to calculate the resolution accurately. Using the Pythagorean theorem, you can derive width and height from the diagonal and aspect ratio, then compute the pixel count. Without aspect ratio, the calculation is ambiguous.",
    },
    {
      question: "What are standard resolution presets used in video production?",
      answer:
        "Common presets include 720p (1280x720), 1080p (1920x1080), 4K UHD (3840x2160), and 8K UHD (7680x4320). These standards ensure compatibility across devices and platforms, and they are widely used in broadcasting, streaming, and digital cinema.",
    },
    {
      question: "How does pixel count affect video file size and quality?",
      answer:
        "Higher pixel counts increase the amount of data per frame, leading to larger file sizes and potentially higher quality images. However, other factors like compression, bit depth, and codec efficiency also influence final file size and quality. Balancing resolution with these factors is key to optimal video production.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Calculating the pixel count for a 4K UHD video frame with a resolution of 3840x2160 pixels.",
    steps: [
      {
        label: "Step 1",
        explanation: "Identify the width and height of the 4K UHD resolution: 3840 pixels wide and 2160 pixels high.",
      },
      {
        label: "Step 2",
        explanation: "Calculate the total pixel count by multiplying width by height: 3840 × 2160 = 8,294,400 pixels.",
      },
      {
        label: "Step 3",
        explanation:
          "Recognize that this pixel count corresponds to the 4K UHD standard, widely used in professional video production for its high detail and clarity.",
      },
    ],
    result: "The 4K UHD resolution has a total pixel count of 8,294,400 pixels.",
  };

  const references = [
    {
      title: "SMPTE Standards",
      description: "Official standards for video and timecode used in broadcasting and production.",
      url: "https://www.smpte.org/",
    },
    {
      title: "Understanding Resolution and Aspect Ratio",
      description:
        "A comprehensive guide explaining how resolution and aspect ratio affect video quality and display.",
      url: "https://www.videomaker.com/article/c10/18714-understanding-resolution-and-aspect-ratio",
    },
    {
      title: "4K UHD Resolution Explained",
      description:
        "Detailed explanation of 4K UHD resolution and its applications in video production.",
      url: "https://www.rtings.com/tv/learn/4k-resolution",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Width (pixels)</Label>
          <Input
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 1920"
            value={inputs.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Height (pixels)</Label>
          <Input
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 1080"
            value={inputs.height}
            onChange={(e) => handleInputChange("height", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Diagonal (inches)</Label>
          <Input
            type="number"
            min={0}
            step="any"
            placeholder="Optional"
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
                <p className="text-sm italic text-blue-700">{results.feedback}</p>
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
          <li>Enter the Width and Height of your video or image resolution in pixels. These are mandatory for pixel count calculation.</li>
          <li>Optionally, enter the Diagonal size in inches if you want to calculate pixel count based on screen size and aspect ratio.</li>
          <li>Click the "Calculate" button to compute the total pixel count and see the closest standard resolution preset.</li>
          <li>Review the detailed explanation and optimization tips provided below the result for better understanding.</li>
          <li>Use the information to select appropriate resolution presets for your video production or post-production workflow.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Resolution Presets & Pixel Count (720p/1080p/4K/8K)
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            In professional video engineering and digital imaging, understanding resolution presets and pixel count is crucial for optimizing quality and performance. Resolution presets such as 720p, 1080p, 4K UHD, and 8K UHD represent standardized pixel dimensions widely adopted in production, broadcasting, and streaming industries. These presets ensure compatibility across devices and platforms while balancing image clarity and data requirements.
          </p>
          <p>
            Pixel count is the total number of pixels in a frame, calculated by multiplying the width by the height in pixels. For example, a 1080p frame has a resolution of 1920x1080 pixels, resulting in 2,073,600 pixels. Higher pixel counts provide more detail but require greater processing power, storage, and bandwidth.
          </p>
          <p>
            When calculating resolution from a diagonal screen size, the aspect ratio (the ratio of width to height) must be known to accurately derive the width and height in pixels. The Pythagorean theorem is used to relate diagonal size to width and height, allowing for precise pixel count calculations based on physical screen dimensions.
          </p>
          <p>
            This calculator helps professionals quickly determine pixel counts from custom resolutions or screen sizes, compare them to standard presets, and make informed decisions about video formats and workflows. Using standard presets is recommended for ensuring smooth playback, editing compatibility, and efficient encoding.
          </p>
          <p>
            Remember, resolution is just one factor affecting video quality. Bit depth, color space, compression, and codec choice also play significant roles. Balancing these elements with resolution presets will lead to optimal results in production and post-production environments.
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
            <strong>Warning:</strong> Entering only the diagonal size without the aspect ratio or both width and height leads to ambiguous or incorrect pixel count calculations. Always provide width and height or a known aspect ratio alongside diagonal measurements.
          </p>
          <p>
            <strong>Warning:</strong> Confusing bits (b) with bytes (B) can cause errors in storage and bandwidth estimations. Remember that 8 bits equal 1 byte.
          </p>
          <p>
            <strong>Warning:</strong> Using non-standard or uncommon aspect ratios without adjusting calculations can result in distorted images or incorrect pixel counts.
          </p>
          <p>
            <strong>Warning:</strong> Relying solely on pixel count without considering codec, compression, and bit depth may lead to suboptimal video quality or file sizes.
          </p>
          <p>
            <strong>Warning:</strong> Ignoring standard resolution presets can cause compatibility issues with playback devices and streaming platforms.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>{example.scenario}</p>
          {example.steps.map((step, i) => (
            <div key={i}>
              <h3 className="font-semibold">{step.label}</h3>
              <p>{step.explanation}</p>
            </div>
          ))}
          <p>
            <strong>Result:</strong> {example.result}
          </p>
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
      title="Resolution Presets & Pixel Count (720p/1080p/4K/8K)"
      description="Professional video & audio calculator: Resolution Presets & Pixel Count (720p/1080p/4K/8K). Accurate technical formulas for production, post-production, and broadcasting."
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