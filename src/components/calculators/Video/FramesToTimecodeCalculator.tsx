import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function parseTimecode(tc: string) {
  // Parse HH:MM:SS:FF format strictly
  const regex = /^(\d{2}):(\d{2}):(\d{2}):(\d{2})$/;
  const match = tc.match(regex);
  if (!match) return null;
  const [_, hh, mm, ss, ff] = match;
  const h = parseInt(hh, 10);
  const m = parseInt(mm, 10);
  const s = parseInt(ss, 10);
  const f = parseInt(ff, 10);
  if (
    h < 0 || h > 23 ||
    m < 0 || m > 59 ||
    s < 0 || s > 59 ||
    f < 0
  ) return null;
  return { h, m, s, f };
}

function framesToTimecode(totalFrames: number, fps: number) {
  // Convert total frames to HH:MM:SS:FF string
  const framesPerHour = fps * 3600;
  const framesPerMinute = fps * 60;

  let frames = totalFrames;

  const h = Math.floor(frames / framesPerHour);
  frames -= h * framesPerHour;

  const m = Math.floor(frames / framesPerMinute);
  frames -= m * framesPerMinute;

  const s = Math.floor(frames / fps);
  frames -= s * fps;

  const f = Math.round(frames);

  // Pad with zeros
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`;
}

function timecodeToFrames(tc: string, fps: number) {
  // Convert HH:MM:SS:FF to total frames
  const parsed = parseTimecode(tc);
  if (!parsed) return null;
  const { h, m, s, f } = parsed;
  if (f >= fps) return null; // Invalid frame number for fps
  return Math.round(h * 3600 * fps + m * 60 * fps + s * fps + f);
}

function apply180DegreeRule(fps: number) {
  // 180 degree shutter rule: shutter angle = 180 degrees
  // shutter speed = 1 / (2 * fps)
  // This is informational, no direct effect on calculation but can be shown as tip
  return `For ${fps} fps, the 180° shutter speed is 1/${Math.round(2 * fps)} sec`;
}

export default function FramesToTimecodeCalculator() {
  const [inputs, setInputs] = useState({
    timecode: "",
    fps: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const { timecode, fps } = inputs;
    const fpsNum = Number(fps);

    if (!timecode || !fps || isNaN(fpsNum) || fpsNum <= 0) {
      return {
        primary: "-",
        secondary: "Frames / Timecode",
        details: "Please enter valid Timecode and FPS values.",
        feedback: "",
      };
    }

    // Validate timecode format and frame number
    const parsed = parseTimecode(timecode);
    if (!parsed) {
      return {
        primary: "-",
        secondary: "Frames / Timecode",
        details: "Invalid timecode format. Use HH:MM:SS:FF with valid ranges.",
        feedback: "",
      };
    }
    if (parsed.f >= fpsNum) {
      return {
        primary: "-",
        secondary: "Frames / Timecode",
        details: `Frame number (FF) must be less than FPS (${fpsNum}).`,
        feedback: "",
      };
    }

    // Calculate total frames from timecode
    const totalFrames = timecodeToFrames(timecode, fpsNum);
    if (totalFrames === null) {
      return {
        primary: "-",
        secondary: "Frames / Timecode",
        details: "Error converting timecode to frames.",
        feedback: "",
      };
    }

    // Also calculate timecode from total frames (should match input)
    const tcFromFrames = framesToTimecode(totalFrames, fpsNum);

    // Provide 180 degree shutter rule tip
    const shutterTip = apply180DegreeRule(fpsNum);

    return {
      primary: totalFrames.toString(),
      secondary: `Frames (from Timecode ${timecode} @ ${fpsNum} fps)`,
      details: `Timecode ${timecode} converts to ${totalFrames} frames at ${fpsNum} fps. Reconverted timecode: ${tcFromFrames}.`,
      feedback: shutterTip,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the 180-degree shutter rule and why is it important?",
      answer:
        "The 180-degree shutter rule is a guideline in cinematography that suggests setting the shutter speed to be double the frame rate, or equivalently, a shutter angle of 180 degrees. This creates natural motion blur that mimics the human eye's perception and results in smooth, cinematic motion. For example, at 24 fps, the shutter speed should be 1/48 second. Adhering to this rule helps maintain consistent motion portrayal and avoids unnatural strobing or excessive blur.",
    },
    {
      question: "How do I convert frames to timecode accurately?",
      answer:
        "To convert frames to timecode, you divide the total frames by the frames per second (fps) to get seconds, then calculate hours, minutes, seconds, and remaining frames. This calculator uses the standard HH:MM:SS:FF format, where FF represents frames less than the fps. Accurate fps input is crucial for correct conversion, especially for non-integer or drop-frame rates.",
    },
    {
      question: "Why must the frame number (FF) be less than the FPS value?",
      answer:
        "In timecode notation, the frame number (FF) represents the frame count within a single second and must be less than the total frames per second (FPS). For example, if your FPS is 30, valid frame numbers range from 00 to 29. If FF equals or exceeds FPS, it is invalid and indicates an error in the timecode input.",
    },
    {
      question: "Can this calculator handle drop-frame timecode?",
      answer:
        "This calculator currently supports standard non-drop-frame timecode calculations. Drop-frame timecode involves skipping certain frame numbers to keep timecode aligned with real time, commonly used in NTSC 29.97 fps video. Handling drop-frame requires additional logic and is not included here. For drop-frame calculations, specialized tools or software are recommended.",
    },
    {
      question: "What are common mistakes when using frames and timecode conversions?",
      answer:
        "Common mistakes include entering invalid timecode formats, using frame numbers equal to or greater than the FPS, confusing drop-frame and non-drop-frame timecode, and using incorrect FPS values. Always verify your inputs and understand the frame rate and timecode standard you are working with to ensure accurate conversions.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You are editing a video shot at 24 fps and want to know how many frames correspond to the timecode 00:10:15:12.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Enter the timecode 00:10:15:12 into the calculator's timecode input field.",
      },
      {
        label: "Step 2",
        explanation: "Enter the frame rate 24 into the FPS input field.",
      },
      {
        label: "Step 3",
        explanation: "Click the Calculate button to get the total frames.",
      },
    ],
    result:
      "The calculator shows that 00:10:15:12 at 24 fps equals 14772 frames. This helps you sync or edit precisely based on frame counts.",
  };

  const references = [
    {
      title: "Understanding Timecode and Frame Rates",
      description:
        "A comprehensive guide to timecode formats, frame rates, and their applications in video production.",
      url: "https://www.videomaker.com/article/c10/18773-understanding-timecode-and-frame-rates",
    },
    {
      title: "The 180 Degree Shutter Rule Explained",
      description:
        "An in-depth explanation of the 180-degree shutter rule and its importance in cinematography.",
      url: "https://www.premiumbeat.com/blog/180-degree-shutter-rule/",
    },
    {
      title: "Frame Rate and Timecode Basics",
      description:
        "Official SMPTE standards and explanations about frame rates and timecode.",
      url: "https://www.smpte.org/standards",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="timecode-input">Timecode (HH:MM:SS:FF)</Label>
          <Input
            id="timecode-input"
            type="text"
            placeholder="00:00:00:00"
            value={inputs.timecode}
            onChange={(e) => handleInputChange("timecode", e.target.value)}
            maxLength={11}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fps-input">Frames Per Second (FPS)</Label>
          <Input
            id="fps-input"
            type="number"
            min={1}
            step="any"
            placeholder="e.g. 24"
            value={inputs.fps}
            onChange={(e) => handleInputChange("fps", e.target.value)}
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
                <p className="text-sm text-slate-700 dark:text-slate-300 italic">{results.feedback}</p>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to use this calculator
        </h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>Enter the timecode in the format HH:MM:SS:FF (hours, minutes, seconds, frames).</li>
          <li>Input the frames per second (FPS) value corresponding to your video footage.</li>
          <li>Click the Calculate button to convert the timecode into total frames.</li>
          <li>Review the result displayed, which shows the total frames and additional details.</li>
          <li>Use the 180-degree shutter rule tip to optimize your shutter speed settings for natural motion blur.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Frames to Timecode Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            In professional video production and post-production, precise timing is crucial. Timecode is a standardized way to label each frame of video with a unique identifier in the format HH:MM:SS:FF, representing hours, minutes, seconds, and frames. This allows editors, colorists, and visual effects artists to synchronize footage accurately.
          </p>
          <p>
            Frames per second (FPS) is the number of individual frames displayed per second of video. Common frame rates include 24, 25, 30, 50, and 60 fps. The frame rate affects how timecode translates into actual frame counts. For example, one second of video at 24 fps contains 24 frames, while at 30 fps it contains 30 frames.
          </p>
          <p>
            This calculator converts a given timecode into the total number of frames based on the specified FPS. It validates the input format and ensures the frame number within the timecode does not exceed the FPS, which would be invalid. The calculator also provides a reconversion to timecode from the calculated frames to verify accuracy.
          </p>
          <p>
            Additionally, the 180-degree shutter rule is highlighted as a best practice for setting shutter speed relative to frame rate. This rule suggests using a shutter speed that is double the frame rate (or a shutter angle of 180 degrees) to achieve natural motion blur that mimics human vision, enhancing the cinematic quality of footage.
          </p>
          <p>
            Understanding these concepts and using this calculator helps professionals maintain technical accuracy and creative control throughout the production and post-production workflow.
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
            <strong>Warning:</strong> Entering timecode in an incorrect format (e.g., missing leading zeros or wrong delimiters) will cause errors in calculation. Always use HH:MM:SS:FF format.
          </p>
          <p>
            <strong>Warning:</strong> The frame number (FF) must always be less than the FPS value. For example, if FPS is 30, FF must be between 00 and 29. Exceeding this range is invalid.
          </p>
          <p>
            <strong>Warning:</strong> Confusing drop-frame and non-drop-frame timecode can lead to inaccurate frame counts. This calculator does not support drop-frame timecode.
          </p>
          <p>
            <strong>Warning:</strong> Using an incorrect FPS value that does not match your footage will produce wrong frame counts and timecode conversions.
          </p>
          <p>
            <strong>Warning:</strong> Forgetting to apply the 180-degree shutter rule may result in unnatural motion blur or strobing effects in your footage.
          </p>
        </div>
      </section>

      <section id="faq">
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
      title="Frames to Timecode Calculator"
      description="Professional video & audio calculator: Frames to Timecode Calculator. Accurate technical formulas for production, post-production, and broadcasting."
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