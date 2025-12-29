import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function parseTimecodeToFrames(tc: string, fps: number): number | null {
  // Parse HH:MM:SS:FF format to total frames
  const regex = /^(\d{2}):(\d{2}):(\d{2}):(\d{2})$/;
  const match = tc.match(regex);
  if (!match) return null;

  const hh = parseInt(match[1], 10);
  const mm = parseInt(match[2], 10);
  const ss = parseInt(match[3], 10);
  const ff = parseInt(match[4], 10);

  if (
    hh < 0 || hh > 23 ||
    mm < 0 || mm > 59 ||
    ss < 0 || ss > 59 ||
    ff < 0 || ff >= fps
  ) return null;

  return ((hh * 3600) + (mm * 60) + ss) * fps + ff;
}

function formatFramesToTimecode(frames: number, fps: number): string {
  // Convert total frames back to HH:MM:SS:FF
  const totalSeconds = Math.floor(frames / fps);
  const ff = frames % fps;
  const hh = Math.floor(totalSeconds / 3600);
  const mm = Math.floor((totalSeconds % 3600) / 60);
  const ss = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(ff)}`;
}

export default function AnimationRenderDurationEstimatorCalculator() {
  const [inputs, setInputs] = useState({
    timecode: "",
    fps: "24",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const fpsNum = Number(inputs.fps);
    if (!inputs.timecode || isNaN(fpsNum) || fpsNum <= 0) {
      return {
        primary: "—",
        secondary: "Frames",
        details: "Please enter a valid timecode and FPS.",
        feedback: "",
      };
    }

    const totalFrames = parseTimecodeToFrames(inputs.timecode, fpsNum);
    if (totalFrames === null) {
      return {
        primary: "—",
        secondary: "Frames",
        details:
          "Invalid timecode format or frame number exceeds FPS. Use HH:MM:SS:FF format.",
        feedback: "",
      };
    }

    // Apply 180-degree shutter rule: Render duration = totalFrames * (1/ (fps * 2))
    // Explanation: 180-degree shutter means exposure time is half the frame duration.
    // So render duration estimate = totalFrames * (1 / (fps * 2)) seconds.
    const renderDurationSeconds = totalFrames / (fpsNum * 2);

    // Format render duration to HH:MM:SS.sss
    const hours = Math.floor(renderDurationSeconds / 3600);
    const minutes = Math.floor((renderDurationSeconds % 3600) / 60);
    const seconds = renderDurationSeconds % 60;

    const pad = (n: number) => n.toString().padStart(2, "0");
    const formattedRenderDuration = `${pad(hours)}:${pad(minutes)}:${seconds.toFixed(3).padStart(6, "0")}`;

    return {
      primary: formattedRenderDuration,
      secondary: "Estimated Render Duration (HH:MM:SS.sss)",
      details: `Total frames: ${totalFrames} frames at ${fpsNum} FPS. Using 180° shutter rule, render duration is half the total frame time.`,
      feedback:
        "Tip: Adjust FPS or timecode to optimize render duration estimates for your animation projects.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the 180-degree shutter rule?",
      answer:
        "The 180-degree shutter rule is a standard in cinematography that sets the shutter speed to half the frame rate. For example, at 24 FPS, the shutter speed is 1/48 second. This rule helps create natural motion blur and is used here to estimate render duration by halving the total frame time.",
    },
    {
      question: "How do I enter the timecode correctly?",
      answer:
        "Enter the timecode in the format HH:MM:SS:FF, where HH is hours (00-23), MM is minutes (00-59), SS is seconds (00-59), and FF is frames (00 to FPS-1). For example, 00:02:15:12 at 24 FPS means 2 minutes, 15 seconds, and 12 frames.",
    },
    {
      question: "Can I use this calculator for any FPS?",
      answer:
        "Yes, you can input any positive FPS value. Common frame rates include 24, 25, 30, 48, 50, and 60 FPS. The calculator adjusts calculations accordingly to provide accurate render duration estimates.",
    },
    {
      question: "Why is the render duration half the total frame time?",
      answer:
        "According to the 180-degree shutter rule, the exposure time per frame is half the frame duration. This means the effective render duration per frame is half the time it takes to display one frame, so total render duration is half the total frame time.",
    },
    {
      question: "What if my timecode frames exceed the FPS?",
      answer:
        "Frames in the timecode must be less than the FPS value. For example, if your FPS is 24, frames should be between 00 and 23. Exceeding this will cause an invalid input error.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have an animation clip with a timecode of 00:05:00:12 at 30 FPS and want to estimate the render duration using the 180-degree shutter rule.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Input the timecode 00:05:00:12 into the calculator's timecode field.",
      },
      {
        label: "Step 2",
        explanation: "Set the FPS value to 30.",
      },
      {
        label: "Step 3",
        explanation:
          "Click Calculate to get the estimated render duration based on the 180-degree shutter rule.",
      },
    ],
    result:
      "The calculator converts the timecode to total frames (5 minutes * 30 FPS + 12 frames = 9012 frames), then estimates the render duration as half the total frame time, resulting in approximately 00:02:30.200 (2 minutes, 30.2 seconds).",
  };

  const references = [
    {
      title: "Understanding the 180-Degree Shutter Rule",
      description:
        "A detailed explanation of the 180-degree shutter rule and its impact on motion blur and exposure time in cinematography.",
      url: "https://www.premiumbeat.com/blog/180-degree-shutter-rule/",
    },
    {
      title: "Timecode Basics",
      description:
        "Comprehensive guide on timecode formats and usage in video production.",
      url: "https://www.videomaker.com/article/c10/18699-timecode-basics",
    },
    {
      title: "Frame Rate and Timecode Explained",
      description:
        "Explains the relationship between frame rate, timecode, and video timing.",
      url: "https://www.studiobinder.com/blog/frame-rate/",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="timecode">Timecode (HH:MM:SS:FF)</Label>
          <Input
            id="timecode"
            type="text"
            placeholder="e.g. 00:02:15:12"
            value={inputs.timecode}
            onChange={(e) => handleInputChange("timecode", e.target.value)}
            maxLength={11}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fps">Frames Per Second (FPS)</Label>
          <Input
            id="fps"
            type="number"
            min={1}
            max={120}
            step={1}
            value={inputs.fps}
            onChange={(e) => handleInputChange("fps", e.target.value)}
            placeholder="e.g. 24"
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" disabled={!inputs.timecode || !inputs.fps}>
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
              <p className="mt-3 text-sm italic text-slate-600 dark:text-slate-400">{results.feedback}</p>
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
          <li>Enter the animation clip's timecode in the format HH:MM:SS:FF (hours, minutes, seconds, frames).</li>
          <li>Input the frames per second (FPS) that your animation uses, such as 24, 30, or 60 FPS.</li>
          <li>Click the Calculate button to compute the estimated render duration based on the 180-degree shutter rule.</li>
          <li>Review the results showing the estimated render duration in HH:MM:SS.sss format along with calculation details.</li>
          <li>Use the feedback tips to optimize your animation settings for efficient rendering.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Animation Render Duration Estimator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Estimating the render duration of an animation is crucial for planning production schedules and resource allocation in video and film projects. This calculator leverages the 180-degree shutter rule, a fundamental principle in cinematography, to provide an accurate estimate of how long rendering an animation clip might take.
          </p>
          <p>
            The 180-degree shutter rule states that the shutter speed should be half the frame rate, which creates natural motion blur and smooth motion perception. For example, at 24 frames per second (FPS), the shutter speed is 1/48 of a second. This means each frame's exposure time is half the duration of the frame itself.
          </p>
          <p>
            By inputting the animation's timecode and FPS, this calculator converts the timecode into total frames and then estimates the render duration by halving the total frame time, consistent with the 180-degree shutter rule. This approach helps professionals anticipate render times more realistically, aiding in workflow optimization and deadline management.
          </p>
          <p>
            Understanding how to read and input timecode correctly is essential. Timecode follows the HH:MM:SS:FF format, where FF represents frames and must be less than the FPS value. Incorrect timecode input can lead to inaccurate calculations or errors.
          </p>
          <p>
            This tool is versatile and supports any FPS value, accommodating various production standards worldwide. Whether you're working in film, television, or digital animation, this calculator provides a reliable estimate to help you manage your render pipeline efficiently.
          </p>
        </div>
      </section>

      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
          <p><strong>Warning:</strong> Entering an invalid timecode format is a frequent error. Ensure you use the exact HH:MM:SS:FF format, with frames less than the FPS value.</p>
          <p><strong>Warning:</strong> Using an FPS value of zero or negative numbers will cause calculation errors. Always input a positive FPS number.</p>
          <p><strong>Warning:</strong> Forgetting that frames (FF) must be less than the FPS can lead to invalid results. For example, at 24 FPS, frames cannot be 24 or higher.</p>
          <p><strong>Warning:</strong> Misunderstanding the 180-degree shutter rule can cause confusion. Remember, it means the exposure time per frame is half the frame duration, not the total animation duration.</p>
          <p><strong>Warning:</strong> Not double-checking inputs before calculation may result in inaccurate render duration estimates, impacting project timelines.</p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="prose prose-slate dark:prose-invert">
          <p><strong>Scenario:</strong> You have an animation clip with a timecode of 00:05:00:12 at 30 FPS and want to estimate the render duration using the 180-degree shutter rule.</p>
          <ol>
            <li>Input the timecode <code>00:05:00:12</code> into the calculator's timecode field.</li>
            <li>Set the FPS value to <code>30</code>.</li>
            <li>Click Calculate to get the estimated render duration based on the 180-degree shutter rule.</li>
          </ol>
          <p><strong>Result:</strong> The calculator converts the timecode to total frames (5 minutes * 30 FPS + 12 frames = 9012 frames), then estimates the render duration as half the total frame time, resulting in approximately <code>00:02:30.200</code> (2 minutes, 30.2 seconds).</p>
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
      title="Animation Render Duration Estimator"
      description="Professional video & audio calculator: Animation Render Duration Estimator. Accurate technical formulas for production, post-production, and broadcasting."
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