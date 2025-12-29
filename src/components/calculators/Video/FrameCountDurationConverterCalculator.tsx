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
  // Parse HH:MM:SS:FF format
  const regex = /^(\d{2}):(\d{2}):(\d{2}):(\d{2})$/;
  const match = tc.match(regex);
  if (!match) return null;
  const [, hh, mm, ss, ff] = match;
  return {
    hh: parseInt(hh, 10),
    mm: parseInt(mm, 10),
    ss: parseInt(ss, 10),
    ff: parseInt(ff, 10),
  };
}

function timecodeToFrames(tc: string, fps: number) {
  // Convert timecode to total frames
  const t = parseTimecode(tc);
  if (!t) return null;
  const { hh, mm, ss, ff } = t;
  return Math.round(hh * 3600 * fps + mm * 60 * fps + ss * fps + ff);
}

function framesToTimecode(frames: number, fps: number) {
  // Convert frames to timecode HH:MM:SS:FF
  if (fps <= 0) return null;
  const totalSeconds = Math.floor(frames / fps);
  const ff = Math.round(frames % fps);
  const hh = Math.floor(totalSeconds / 3600);
  const mm = Math.floor((totalSeconds % 3600) / 60);
  const ss = totalSeconds % 60;
  // Pad with zeros
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(ff)}`;
}

export default function FrameCountDurationConverterCalculator() {
  const [inputs, setInputs] = useState({
    timecode: "",
    frames: "",
    fps: "",
    mode: "tc-to-frames", // or "frames-to-tc"
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // 180-degree shutter rule explanation helper
  const shutterRuleNote =
    "According to the 180-degree shutter rule, the shutter speed is typically set to double the frame rate (e.g., at 24fps, shutter speed is 1/48s). This affects motion blur and perceived duration but does not change frame count or timecode conversions.";

  const results = useMemo(() => {
    const fpsNum = parseFloat(inputs.fps);
    if (isNaN(fpsNum) || fpsNum <= 0) {
      return {
        primary: "-",
        secondary: "Invalid FPS",
        details: "Please enter a valid positive number for FPS.",
        feedback: "",
      };
    }

    if (inputs.mode === "tc-to-frames") {
      if (!inputs.timecode) {
        return {
          primary: "-",
          secondary: "Enter Timecode",
          details: "Please input a timecode in HH:MM:SS:FF format.",
          feedback: "",
        };
      }
      const frames = timecodeToFrames(inputs.timecode, fpsNum);
      if (frames === null) {
        return {
          primary: "-",
          secondary: "Invalid Timecode",
          details: "Timecode must be in HH:MM:SS:FF format (e.g., 01:23:45:12).",
          feedback: "",
        };
      }
      return {
        primary: frames.toString(),
        secondary: "Frames",
        details: `Timecode ${inputs.timecode} at ${fpsNum} FPS equals ${frames} frames.`,
        feedback: shutterRuleNote,
      };
    } else {
      // frames-to-tc
      const framesNum = parseInt(inputs.frames, 10);
      if (isNaN(framesNum) || framesNum < 0) {
        return {
          primary: "-",
          secondary: "Invalid Frame Count",
          details: "Please enter a valid non-negative integer for frame count.",
          feedback: "",
        };
      }
      const tc = framesToTimecode(framesNum, fpsNum);
      if (tc === null) {
        return {
          primary: "-",
          secondary: "Conversion Error",
          details: "Could not convert frames to timecode with given FPS.",
          feedback: "",
        };
      }
      return {
        primary: tc,
        secondary: "Timecode (HH:MM:SS:FF)",
        details: `${framesNum} frames at ${fpsNum} FPS equals timecode ${tc}.`,
        feedback: shutterRuleNote,
      };
    }
  }, [inputs]);

  const faqs = [
    {
      question: "What is the 180-degree shutter rule and how does it affect frame count?",
      answer:
        "The 180-degree shutter rule is a guideline in cinematography that sets the shutter speed to be double the frame rate, creating natural motion blur. While it affects the visual appearance of motion, it does not change the actual frame count or duration calculations. This calculator focuses on frame count and timecode conversions, independent of shutter settings.",
    },
    {
      question: "How do I correctly format the timecode input?",
      answer:
        "Timecode must be entered in the HH:MM:SS:FF format, where HH is hours, MM is minutes, SS is seconds, and FF is frames. Each segment should be two digits, for example, 01:23:45:12. The frames (FF) must be less than the FPS value you enter to avoid invalid timecodes.",
    },
    {
      question: "Can I use fractional frame rates like 23.976 or 29.97?",
      answer:
        "Yes, this calculator supports fractional frame rates such as 23.976 and 29.97. When using fractional FPS, frame count and timecode conversions are rounded to the nearest frame to maintain accuracy in professional video workflows.",
    },
    {
      question: "What happens if I enter an invalid FPS or timecode?",
      answer:
        "The calculator will notify you with an error message indicating the invalid input. Ensure FPS is a positive number and timecode follows the HH:MM:SS:FF format. Correct inputs are essential for accurate conversions.",
    },
    {
      question: "Why is frame count important in video production?",
      answer:
        "Frame count is crucial for editing, syncing audio, and timing visual effects accurately. It allows professionals to precisely measure duration and coordinate elements within a video timeline, ensuring smooth post-production workflows.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have a clip with a timecode duration of 00:02:30:15 and you want to know how many frames it contains at 24 FPS.",
    steps: [
      {
        label: "Step 1",
        explanation: "Select the 'Timecode to Frames' mode.",
      },
      {
        label: "Step 2",
        explanation: "Enter the timecode 00:02:30:15 into the timecode input field.",
      },
      {
        label: "Step 3",
        explanation: "Enter 24 as the FPS value.",
      },
      {
        label: "Step 4",
        explanation: "Click 'Calculate' to get the total frame count.",
      },
    ],
    result:
      "The calculator will show that 00:02:30:15 at 24 FPS equals 3615 frames.",
  };

  const references = [
    {
      title: "Understanding Timecode and Frame Rates",
      description:
        "A comprehensive guide on timecode formats and frame rate standards in video production.",
      url: "https://www.videomaker.com/article/c10/18703-understanding-timecode-and-frame-rates",
    },
    {
      title: "The 180 Degree Shutter Rule Explained",
      description:
        "An in-depth explanation of the 180-degree shutter rule and its impact on motion blur.",
      url: "https://www.premiumbeat.com/blog/180-degree-shutter-rule/",
    },
    {
      title: "Frame Rate and Timecode Conversion Basics",
      description:
        "Technical overview of frame rate conversions and timecode calculations for video professionals.",
      url: "https://www.videoguys.com/blog/understanding-frame-rates-and-timecode/",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-center gap-4 mb-4">
        <Button
          variant={inputs.mode === "tc-to-frames" ? "default" : "outline"}
          onClick={() => setInputs((prev) => ({ ...prev, mode: "tc-to-frames", frames: "" }))}
          className="w-40"
        >
          Timecode → Frames
        </Button>
        <Button
          variant={inputs.mode === "frames-to-tc" ? "default" : "outline"}
          onClick={() => setInputs((prev) => ({ ...prev, mode: "frames-to-tc", timecode: "" }))}
          className="w-40"
        >
          Frames → Timecode
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {inputs.mode === "tc-to-frames" ? (
          <div className="space-y-2">
            <Label htmlFor="timecode-input">Timecode (HH:MM:SS:FF)</Label>
            <Input
              id="timecode-input"
              type="text"
              placeholder="e.g. 01:23:45:12"
              value={inputs.timecode}
              onChange={(e) => handleInputChange("timecode", e.target.value)}
              maxLength={11}
              spellCheck={false}
              autoComplete="off"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="frames-input">Frame Count</Label>
            <Input
              id="frames-input"
              type="number"
              min={0}
              step={1}
              placeholder="e.g. 3600"
              value={inputs.frames}
              onChange={(e) => handleInputChange("frames", e.target.value)}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="fps-input">Frames Per Second (FPS)</Label>
          <Input
            id="fps-input"
            type="number"
            min={0.01}
            step={0.001}
            placeholder="e.g. 24, 29.97"
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
            <Separator className="my-4" />
            <p className="text-xs italic text-slate-400">{results.feedback}</p>
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
            Choose the conversion mode by selecting either <strong>Timecode → Frames</strong> or{" "}
            <strong>Frames → Timecode</strong>.
          </li>
          <li>
            Enter the timecode in <code>HH:MM:SS:FF</code> format or the total frame count, depending on the mode.
          </li>
          <li>Input the frames per second (FPS) value for your project (e.g., 24, 29.97, 30).</li>
          <li>Click the <strong>Calculate</strong> button to see the converted result.</li>
          <li>
            Review the result and details below the calculator for accurate frame count or timecode duration.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Frame Count ↔ Duration Converter
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            In video production and post-production, understanding the relationship between frame count and duration
            is essential for precise editing, syncing, and timing. This calculator converts between timecode and frame
            count using the frames per second (FPS) value, which defines how many frames are displayed per second in a
            video.
          </p>
          <p>
            Timecode is a standardized way to represent time in video, formatted as hours, minutes, seconds, and frames
            (HH:MM:SS:FF). Frame count is the total number of individual frames in a clip or sequence. By knowing the FPS,
            you can convert timecode to frames and vice versa accurately.
          </p>
          <p>
            The 180-degree shutter rule is a cinematography principle that sets the shutter speed to double the frame rate,
            creating natural motion blur. While this affects the visual quality of motion, it does not impact the frame
            count or timecode duration calculations. This calculator focuses solely on the mathematical conversion between
            frames and timecode.
          </p>
          <p>
            When using fractional frame rates like 23.976 or 29.97, the calculator rounds frame counts to the nearest whole
            frame to maintain professional accuracy. Always ensure your inputs are valid and formatted correctly to get
            precise results.
          </p>
          <p>
            This tool is invaluable for video editors, colorists, DITs, and post-production professionals who need to
            quickly convert durations and frame counts for editing timelines, conforming footage, or syncing audio and
            effects.
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
            <strong>Warning:</strong> Entering timecode in an incorrect format (not HH:MM:SS:FF) will cause conversion
            errors. Always use two digits per segment and separate with colons.
          </p>
          <p>
            <strong>Warning:</strong> Using an FPS value of zero or negative numbers is invalid and will prevent
            calculations.
          </p>
          <p>
            <strong>Warning:</strong> When entering frames, fractional or negative numbers are not accepted; use whole,
            positive integers only.
          </p>
          <p>
            <strong>Warning:</strong> Forgetting to match the frame count segment in timecode (FF) to be less than the
            FPS can cause inaccurate results.
          </p>
          <p>
            <strong>Warning:</strong> Confusing the 180-degree shutter rule with frame rate can lead to misunderstandings;
            shutter speed affects motion blur, not frame count or duration.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="space-y-4 text-slate-700 dark:text-slate-300">
          <p>
            <strong>Scenario:</strong> You have a clip with a timecode duration of <code>00:02:30:15</code> and want to
            find out how many frames it contains at 24 FPS.
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Select the <strong>Timecode → Frames</strong> mode.</li>
            <li>Enter the timecode <code>00:02:30:15</code> into the timecode input field.</li>
            <li>Enter <code>24</code> as the FPS value.</li>
            <li>Click <strong>Calculate</strong> to get the total frame count.</li>
          </ol>
          <p>
            <strong>Result:</strong> The calculator shows that <code>00:02:30:15</code> at 24 FPS equals <strong>3615</strong>{" "}
            frames.
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