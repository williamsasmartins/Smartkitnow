import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Film,
  BookOpen,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function FrameRateShutterSpeedCalculator() {
  const [inputs, setInputs] = useState({
    fps: "",
    shutter: "",
    shutterType: "angle", // "angle" or "time"
    duration: "", // in seconds
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const fps = parseFloat(inputs.fps);
    const shutterInput = parseFloat(inputs.shutter);
    const duration = parseFloat(inputs.duration);

    if (
      isNaN(fps) ||
      fps <= 0 ||
      isNaN(shutterInput) ||
      shutterInput <= 0 ||
      isNaN(duration) ||
      duration <= 0
    ) {
      return {
        primary: "—",
        secondary: "",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "",
      };
    }

    // Calculate shutter speed in seconds
    // If shutterType is angle, use 180 degree rule: shutterSpeed = (shutterAngle / 360) / fps
    // If shutterType is time, shutterInput is shutter speed in seconds directly
    let shutterSpeedSec = 0;
    if (inputs.shutterType === "angle") {
      shutterSpeedSec = (shutterInput / 360) / fps;
    } else {
      shutterSpeedSec = shutterInput;
    }

    // Calculate frames count in given duration
    const framesCount = fps * duration;

    // Calculate exposure time per frame in milliseconds
    const shutterSpeedMs = shutterSpeedSec * 1000;

    // Details string
    const details = `At ${fps.toFixed(2)} FPS with a shutter ${
      inputs.shutterType === "angle" ? "angle" : "speed"
    } of ${shutterInput}${
      inputs.shutterType === "angle" ? "°" : "s"
    }, the shutter speed is ${shutterSpeedMs.toFixed(
      2
    )} ms per frame. Over ${duration} seconds, you will capture approximately ${framesCount.toFixed(
      0
    )} frames.`;

    // Feedback tip
    const feedback =
      shutterSpeedSec === 1 / (2 * fps)
        ? "You are following the 180° shutter rule, which provides natural motion blur for cinematic look."
        : shutterSpeedSec < 1 / (2 * fps)
        ? "Your shutter speed is faster than 180°, resulting in crisper motion but potentially choppier motion blur."
        : "Your shutter speed is slower than 180°, which may cause excessive motion blur.";

    return {
      primary: shutterSpeedMs.toFixed(2),
      secondary: "Shutter Speed (ms)",
      details,
      feedback,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the 180 degree shutter rule?",
      answer:
        "The 180 degree shutter rule is a standard in cinematography that sets the shutter angle to 180°, which means the shutter speed is half the frame duration. For example, at 24 FPS, the shutter speed is 1/48 second. This rule helps achieve natural motion blur that mimics the human eye's perception, balancing sharpness and blur for pleasing motion rendition.",
    },
    {
      question: "How does shutter angle affect motion blur?",
      answer:
        "Shutter angle directly controls the exposure time per frame, thus affecting motion blur. A larger shutter angle (e.g., 270°) results in longer exposure and more motion blur, while a smaller angle (e.g., 90°) shortens exposure and reduces blur. Adjusting shutter angle is crucial for creative control over the dynamic range and perceived motion quality in video.",
    },
    {
      question: "Can I input shutter speed instead of shutter angle?",
      answer:
        "Yes, this calculator supports both shutter angle and shutter speed inputs. When using shutter speed, input the exposure time in seconds (e.g., 0.01 for 1/100s). This is useful for cameras that specify shutter speed directly or when precise exposure timing is needed for synchronization with lighting or effects.",
    },
    {
      question: "Why is frame rate important for shutter speed calculation?",
      answer:
        "Frame rate determines the duration of each frame, which is the basis for calculating shutter speed when using shutter angle. The exposure time per frame must be a fraction of the frame duration to maintain consistent motion blur and avoid flicker. Understanding this relationship improves signal-to-noise ratio and dynamic range by optimizing exposure.",
    },
    {
      question: "How does shutter speed affect image quality?",
      answer:
        "Shutter speed influences motion blur and exposure. Faster shutter speeds reduce motion blur but require more light or higher ISO, potentially increasing noise and reducing dynamic range. Slower shutter speeds increase motion blur and can cause flicker with artificial lighting. Balancing shutter speed with frame rate and lighting conditions is key to optimal image quality.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Shooting a 2-hour interview at 24 FPS with a 180° shutter angle in 4K ProRes 422 HQ format.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Calculate shutter speed using the 180° rule: shutter speed = (180° / 360°) / 24 FPS = 1/48 seconds ≈ 0.0208 s.",
      },
      {
        label: "Step 2",
        explanation:
          "Calculate total frames: 24 FPS × 2 hours × 3600 seconds = 172,800 frames.",
      },
      {
        label: "Step 3",
        explanation:
          "Assuming 4K ProRes 422 HQ bitrate ~220 Mbps (megabits per second), calculate total data size: 220 Mbps × 2 hours × 3600 seconds = 1,584,000 Mb.",
      },
      {
        label: "Step 4",
        explanation:
          "Convert megabits to gigabytes: 1,584,000 Mb ÷ 8 (bits to bytes) ÷ 1024 (MB) ÷ 1024 (GB) ≈ 189.3 GB.",
      },
    ],
    result:
      "The shoot will generate approximately 189.3 GB of data with a shutter speed of 1/48s (20.8 ms) per frame, ensuring cinematic motion blur and optimal dynamic range.",
  };

  const references = [
    {
      title: "ARRI Formats & Data Rate Calculator",
      description: "Industry standard reference for camera formats and data rates.",
      url: "https://www.arri.com/en/learn-help/camera-systems/arri-camera-formats",
    },
    {
      title: "RED Tools",
      description: "Official RED cinema camera tools and calculators.",
      url: "https://www.red.com/tools",
    },
    {
      title: "Cinematography 101: Shutter Angle Explained",
      description:
        "In-depth article explaining shutter angle and its impact on motion blur and exposure.",
      url: "https://www.premiumbeat.com/blog/shutter-angle-explained/",
    },
    {
      title: "Understanding Frame Rate and Shutter Speed",
      description:
        "Technical guide on the relationship between frame rate, shutter speed, and image quality.",
      url: "https://nofilmschool.com/shutter-speed-frame-rate",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select
          value={inputs.shutterType}
          onValueChange={(value) => handleInputChange("shutterType", value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="angle">Shutter Angle (°)</SelectItem>
            <SelectItem value="time">Shutter Speed (s)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fps">Frame Rate (FPS)</Label>
          <Input
            id="fps"
            type="number"
            min="1"
            step="0.01"
            placeholder="e.g. 24"
            value={inputs.fps}
            onChange={(e) => handleInputChange("fps", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="shutter">
            {inputs.shutterType === "angle"
              ? "Shutter Angle (°)"
              : "Shutter Speed (seconds)"}
          </Label>
          <Input
            id="shutter"
            type="number"
            min="0"
            step="0.0001"
            placeholder={
              inputs.shutterType === "angle" ? "e.g. 180" : "e.g. 0.0208"
            }
            value={inputs.shutter}
            onChange={(e) => handleInputChange("shutter", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration (seconds)</Label>
          <Input
            id="duration"
            type="number"
            min="1"
            step="1"
            placeholder="e.g. 3600"
            value={inputs.duration}
            onChange={(e) => handleInputChange("duration", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Film className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">
              Result
            </span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.primary}
            </div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="mt-3 italic text-sm text-blue-700">{results.feedback}</p>
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
          <li>
            Enter the frame rate (FPS) of your video project. This is the number
            of frames captured per second.
          </li>
          <li>
            Select whether you want to input shutter angle (degrees) or shutter
            speed (seconds), then enter the corresponding value.
          </li>
          <li>
            Enter the total duration of the footage you plan to shoot or analyze,
            in seconds.
          </li>
          <li>
            Click "Calculate" to see the shutter speed in milliseconds per frame,
            total frames captured, and detailed information.
          </li>
          <li>
            Use the feedback and details to optimize your shutter settings for
            desired motion blur and image quality.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Frame Rate (FPS) ↔ Shutter Speed
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Understanding the relationship between frame rate and shutter speed is
            fundamental in professional video production and digital imaging
            technology. Frame rate, measured in frames per second (FPS), dictates
            how many individual images are captured or displayed each second. Shutter
            speed, often expressed as a shutter angle or exposure time, controls how
            long each frame is exposed to light. This exposure duration directly
            influences motion blur, image sharpness, and overall visual aesthetics.
          </p>
          <p>
            The 180 degree shutter rule is a widely adopted standard in cinematography
            that sets the shutter angle to 180°, meaning the shutter speed is half
            the frame duration. For example, at 24 FPS, the frame duration is 1/24
            seconds (~41.67 ms), so the shutter speed is 1/48 seconds (~20.83 ms).
            This balance produces natural motion blur that closely mimics human
            vision, enhancing the cinematic feel of footage.
          </p>
          <p>
            Shutter angle is a rotational measurement of the camera's shutter
            mechanism, representing the fraction of the frame time the sensor is
            exposed. Alternatively, shutter speed can be specified directly in
            seconds or fractions thereof. Both methods are interchangeable but must
            be used consistently for accurate exposure and motion portrayal.
          </p>
          <p>
            When shooting video, the choice of shutter speed affects dynamic range,
            signal-to-noise ratio, and chroma subsampling quality. Faster shutter
            speeds reduce motion blur but require more light or higher ISO, which
            can increase noise and reduce dynamic range. Conversely, slower shutter
            speeds increase motion blur and can introduce flicker with artificial
            lighting sources.
          </p>
          <p>
            This calculator helps professionals quickly convert between frame rate,
            shutter angle, and shutter speed, while also estimating total frames
            captured over a specified duration. This is essential for planning
            storage, post-production workflows, and ensuring consistent image
            quality across different shooting scenarios.
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
            <strong>Warning:</strong> Confusing shutter angle with shutter speed can
            lead to incorrect exposure and motion blur. Always verify which unit you
            are inputting. Using shutter speeds that do not align with the frame rate
            (e.g., not following the 180° rule) may cause unnatural motion artifacts
            or flicker, especially under artificial lighting.
          </p>
          <p>
            Entering zero or negative values for FPS, shutter angle, or duration will
            produce invalid results. Ensure all inputs are positive and within
            realistic ranges. Neglecting to account for the difference between bits
            and bytes when calculating data rates can cause storage estimation errors.
          </p>
          <p>
            Ignoring the impact of shutter speed on dynamic range and signal-to-noise
            ratio can degrade image quality. Faster shutter speeds reduce light
            capture, increasing noise, while slower speeds may cause excessive blur.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>{example.scenario}</p>
          <ol>
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
            <div
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0"
            >
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">
                {faq.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-5 h-5 text-blue-500" /> References & additional
          resources
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
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {ref.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Frame Rate (FPS) ↔ Shutter Speed"
      description="Professional video & audio calculator: Frame Rate (FPS) ↔ Shutter Speed. Accurate technical formulas for production, post-production, and broadcasting."
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