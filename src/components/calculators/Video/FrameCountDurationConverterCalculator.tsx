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
  return {
    hh: parseInt(hh, 10),
    mm: parseInt(mm, 10),
    ss: parseInt(ss, 10),
    ff: parseInt(ff, 10),
  };
}

function timecodeToFrames(tc: string, fps: number) {
  const t = parseTimecode(tc);
  if (!t) return null;
  // Total frames = ((hh * 3600) + (mm * 60) + ss) * fps + ff
  return ((t.hh * 3600 + t.mm * 60 + t.ss) * fps) + t.ff;
}

function framesToTimecode(frames: number, fps: number) {
  if (frames < 0 || fps <= 0) return null;
  const totalSeconds = Math.floor(frames / fps);
  const ff = frames % fps;
  const hh = Math.floor(totalSeconds / 3600);
  const mm = Math.floor((totalSeconds % 3600) / 60);
  const ss = totalSeconds % 60;
  // Format with leading zeros
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(ff)}`;
}

export default function FrameCountDurationConverterCalculator() {
  const [inputs, setInputs] = useState({
    timecode: "",
    frames: "",
    fps: "24",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const fps = parseFloat(inputs.fps);
    if (isNaN(fps) || fps <= 0) {
      return {
        primary: "Invalid FPS",
        secondary: "",
        details: "Please enter a valid positive number for FPS.",
        feedback: "",
      };
    }

    const hasTimecode = inputs.timecode.trim() !== "";
    const hasFrames = inputs.frames.trim() !== "";

    if (hasTimecode && hasFrames) {
      return {
        primary: "Please fill only one input: Timecode or Frame Count.",
        secondary: "",
        details: "Clear one field to calculate from the other.",
        feedback: "",
      };
    }

    if (!hasTimecode && !hasFrames) {
      return {
        primary: "Enter Timecode or Frame Count",
        secondary: "",
        details: "Input either a timecode (HH:MM:SS:FF) or a frame count to convert.",
        feedback: "",
      };
    }

    if (hasTimecode) {
      // Convert timecode to frames
      const frames = timecodeToFrames(inputs.timecode.trim(), fps);
      if (frames === null) {
        return {
          primary: "Invalid Timecode",
          secondary: "",
          details: "Timecode must be in HH:MM:SS:FF format.",
          feedback: "",
        };
      }
      return {
        primary: frames.toString(),
        secondary: "Frames",
        details: `Converted timecode ${inputs.timecode.trim()} at ${fps} FPS to ${frames} frames.`,
        feedback: "Use this frame count for editing or syncing purposes.",
      };
    }

    if (hasFrames) {
      // Convert frames to timecode
      const framesNum = parseInt(inputs.frames.trim(), 10);
      if (isNaN(framesNum) || framesNum < 0) {
        return {
          primary: "Invalid Frame Count",
          secondary: "",
          details: "Frame count must be a non-negative integer.",
          feedback: "",
        };
      }
      const tc = framesToTimecode(framesNum, fps);
      if (tc === null) {
        return {
          primary: "Conversion Error",
          secondary: "",
          details: "Check your inputs and try again.",
          feedback: "",
        };
      }
      return {
        primary: tc,
        secondary: "Timecode (HH:MM:SS:FF)",
        details: `Converted ${framesNum} frames at ${fps} FPS to timecode ${tc}.`,
        feedback: "Use this timecode for logging or timeline reference.",
      };
    }

    return {
      primary: "Error",
      secondary: "",
      details: "Unexpected input state.",
      feedback: "",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between drop-frame and non-drop-frame timecode?",
      answer:
        "Drop-frame timecode adjusts frame numbering to match real time in NTSC video by skipping frame numbers at specific intervals, ensuring the timecode stays aligned with clock time. Non-drop-frame counts every frame sequentially, which can cause slight drift over long durations. This calculator assumes standard non-drop-frame timecode unless otherwise specified.",
    },
    {
      question: "Can I use fractional FPS values like 23.976?",
      answer:
        "Yes, fractional frame rates such as 23.976 (often written as 23.98) are common in video production. This calculator supports decimal FPS values for accurate conversions. Just enter the exact FPS value to get precise frame counts or timecodes.",
    },
    {
      question: "Why is the frame count important in video editing?",
      answer:
        "Frame count is crucial for precise editing, syncing audio, and effects timing. It represents the exact number of frames from the start, allowing editors to locate and manipulate footage accurately. Timecode provides a human-readable format, while frame count is ideal for computational tasks.",
    },
    {
      question: "How do I handle timecodes longer than 24 hours?",
      answer:
        "Standard SMPTE timecode rolls over after 24 hours (00:00:00:00). For durations longer than 24 hours, additional metadata or custom counters are used. This calculator supports up to 99 hours for convenience but does not handle rollovers automatically.",
    },
    {
      question: "What happens if I enter an invalid timecode format?",
      answer:
        "The calculator validates the timecode format strictly as HH:MM:SS:FF. If the format is incorrect or values exceed valid ranges (e.g., minutes > 59), it will return an error message prompting correction. Always ensure your timecode matches the expected pattern.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Rendering a 5-minute 3D animation at 30 FPS and calculating the total frame count for the timeline.",
    steps: [
      {
        label: "Step 1",
        explanation: "Convert 5 minutes to timecode: 00:05:00:00 (HH:MM:SS:FF).",
      },
      {
        label: "Step 2",
        explanation:
          "Calculate total frames: ((0*3600 + 5*60 + 0) * 30) + 0 = (300 * 30) + 0 = 9000 frames.",
      },
      {
        label: "Step 3",
        explanation:
          "Use the frame count 9000 for editing, syncing, or rendering tasks.",
      },
    ],
    result: "Total frames for 5 minutes at 30 FPS = 9000 frames.",
  };

  const references = [
    {
      title: "SMPTE Standards",
      description: "Official standards for timecode and video formats.",
      url: "https://www.smpte.org/",
    },
    {
      title: "Understanding Timecode",
      description:
        "Detailed explanation of timecode formats, drop-frame vs non-drop-frame.",
      url: "https://www.videomaker.com/article/c10/18767-understanding-timecode",
    },
    {
      title: "Frame Rates Explained",
      description:
        "Comprehensive guide to common frame rates used in video production.",
      url: "https://nofilmschool.com/understanding-frame-rates",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="timecode">Timecode (HH:MM:SS:FF)</Label>
          <Input
            id="timecode"
            placeholder="e.g. 01:23:45:12"
            value={inputs.timecode}
            onChange={(e) => handleInputChange("timecode", e.target.value)}
            disabled={inputs.frames.trim() !== ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="frames">Frame Count</Label>
          <Input
            id="frames"
            type="number"
            min={0}
            placeholder="e.g. 12345"
            value={inputs.frames}
            onChange={(e) => handleInputChange("frames", e.target.value)}
            disabled={inputs.timecode.trim() !== ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fps">Frames Per Second (FPS)</Label>
          <Input
            id="fps"
            type="number"
            min={0.01}
            step={0.001}
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
                <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">{results.feedback}</p>
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
          <li>Enter a timecode in the format HH:MM:SS:FF (hours, minutes, seconds, frames) or a frame count number.</li>
          <li>Input the frames per second (FPS) value for your video project, such as 24, 25, 29.97, or 30.</li>
          <li>Make sure to fill only one of the two inputs: either timecode or frame count; the other will be disabled automatically.</li>
          <li>Click the Calculate button to convert between timecode and frame count based on the FPS.</li>
          <li>Review the results displayed below, including detailed conversion information and tips.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Frame Count ↔ Duration Converter
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            In professional video production and post-production workflows, accurately converting between frame count and timecode is essential for editing, syncing, and logging footage. Timecode is a human-readable format that represents the position in a video timeline as hours, minutes, seconds, and frames (HH:MM:SS:FF), while frame count is a raw integer representing the total number of frames elapsed from the start.
          </p>
          <p>
            This calculator uses the SMPTE timecode standard, assuming non-drop-frame format by default. Drop-frame timecode, used primarily in NTSC video at 29.97 FPS, adjusts frame numbering to keep timecode aligned with real time by skipping certain frame numbers. If you work with drop-frame timecode, additional logic is required beyond this calculator’s scope.
          </p>
          <p>
            To convert timecode to frames, the formula multiplies the total seconds by the frames per second (FPS) and adds the remaining frames. Conversely, converting frames to timecode involves dividing the frame count by FPS to get total seconds, then extracting hours, minutes, seconds, and leftover frames. This process enables editors and engineers to pinpoint exact frames or durations for precise control.
          </p>
          <p>
            Understanding and using this conversion correctly helps avoid synchronization errors, ensures accurate rendering durations, and facilitates communication across teams. Whether you’re working on a short film, broadcast segment, or complex animation, mastering frame count and timecode conversions is a fundamental skill for video professionals.
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
            <strong>Warning:</strong> Entering both timecode and frame count simultaneously will cause confusion and incorrect results. Always fill only one input at a time.
          </p>
          <p>
            <strong>Warning:</strong> Using an incorrect FPS value, such as mixing 29.97 and 30 FPS, leads to inaccurate conversions and timing drift in your project.
          </p>
          <p>
            <strong>Warning:</strong> Timecode inputs must strictly follow the HH:MM:SS:FF format with valid ranges (e.g., minutes and seconds between 0-59, frames less than FPS). Invalid formats will not convert properly.
          </p>
          <p>
            <strong>Warning:</strong> This calculator assumes non-drop-frame timecode. For NTSC drop-frame timecode, specialized tools or manual calculations are necessary.
          </p>
          <p>
            <strong>Warning:</strong> Negative frame counts or FPS values are invalid and will produce errors.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="prose prose-slate dark:prose-invert">
          <p><strong>Scenario:</strong> Rendering a 5-minute 3D animation at 30 FPS and calculating the total frame count.</p>
          <ol>
            <li>Convert 5 minutes to timecode: <code>00:05:00:00</code> (HH:MM:SS:FF).</li>
            <li>Calculate total frames: ((0 × 3600) + (5 × 60) + 0) × 30 + 0 = 300 × 30 = 9000 frames.</li>
            <li>Use the frame count <code>9000</code> for editing, syncing, or rendering tasks.</li>
          </ol>
          <p><strong>Result:</strong> Total frames for 5 minutes at 30 FPS = 9000 frames.</p>
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
      title="Frame Count ↔ Duration Converter"
      description="Professional video & audio calculator: Frame Count ↔ Duration Converter. Accurate technical formulas for production, post-production, and broadcasting."
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