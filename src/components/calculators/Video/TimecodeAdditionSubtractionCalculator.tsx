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
  const regex = /^(\d{1,2}):([0-5]\d):([0-5]\d):(\d{1,2})$/;
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
  const parsed = parseTimecode(tc);
  if (!parsed) return null;
  const { hh, mm, ss, ff } = parsed;
  if (ff >= fps) return null; // invalid frame number
  return ((hh * 3600) + (mm * 60) + ss) * fps + ff;
}

function framesToTimecode(frames: number, fps: number) {
  if (frames < 0) frames = 0;
  const hh = Math.floor(frames / (3600 * fps));
  frames -= hh * 3600 * fps;
  const mm = Math.floor(frames / (60 * fps));
  frames -= mm * 60 * fps;
  const ss = Math.floor(frames / fps);
  const ff = frames - ss * fps;
  return [
    hh.toString().padStart(2, "0"),
    mm.toString().padStart(2, "0"),
    ss.toString().padStart(2, "0"),
    ff.toString().padStart(2, "0"),
  ].join(":");
}

function validateFps(fpsStr: string) {
  // Accept common fps values, including fractional (e.g. 23.976)
  const fps = Number(fpsStr);
  if (isNaN(fps) || fps <= 0 || fps > 120) return null;
  return fps;
}

export default function TimecodeAdditionSubtractionCalculator() {
  const [inputs, setInputs] = useState({
    timecode1: "",
    timecode2: "",
    fps: "30",
    operation: "add", // "add" or "subtract"
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const fps = validateFps(inputs.fps);
    if (!fps) {
      return {
        primary: "Invalid FPS",
        secondary: "",
        details: "FPS must be a positive number up to 120.",
        feedback: "",
      };
    }
    const frames1 = timecodeToFrames(inputs.timecode1, fps);
    const frames2 = timecodeToFrames(inputs.timecode2, fps);
    if (frames1 === null) {
      return {
        primary: "Invalid Timecode 1",
        secondary: "",
        details:
          "Timecode 1 must be in HH:MM:SS:FF format with frames less than FPS.",
        feedback: "",
      };
    }
    if (frames2 === null) {
      return {
        primary: "Invalid Timecode 2",
        secondary: "",
        details:
          "Timecode 2 must be in HH:MM:SS:FF format with frames less than FPS.",
        feedback: "",
      };
    }

    let resultFrames = 0;
    if (inputs.operation === "add") {
      resultFrames = frames1 + frames2;
    } else {
      resultFrames = frames1 - frames2;
      if (resultFrames < 0) resultFrames = 0;
    }

    const resultTimecode = framesToTimecode(resultFrames, fps);

    // 180-degree shutter rule note (common in video)
    const shutterAngleNote =
      "Note: For 180° shutter rule, shutter speed = 1/(2*FPS).";

    return {
      primary: resultTimecode,
      secondary: `Resulting Timecode (${fps} FPS)`,
      details: `Calculation: ${inputs.timecode1} ${
        inputs.operation === "add" ? "+" : "-"
      } ${inputs.timecode2} = ${resultTimecode} at ${fps} FPS. ${shutterAngleNote}`,
      feedback:
        "Ensure your input timecodes are valid and FPS matches your footage settings for accurate results.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is timecode in video production?",
      answer:
        "Timecode is a sequence of numeric codes generated at regular intervals by a timing synchronization system. It is used in video production to uniquely identify each frame of video, facilitating editing, synchronization, and logging. Timecode is typically displayed in the format HH:MM:SS:FF, where FF represents frames.",
    },
    {
      question: "Why is FPS important when calculating timecode?",
      answer:
        "Frames per second (FPS) defines how many frames are displayed in one second of video. Since timecode includes frames, knowing the FPS is essential to convert timecode to total frames and vice versa. Different FPS values affect the duration and frame count calculations, so accuracy depends on using the correct FPS.",
    },
    {
      question: "What is the 180-degree shutter rule?",
      answer:
        "The 180-degree shutter rule is a guideline in cinematography that suggests the shutter speed should be set to double the frame rate, i.e., shutter speed = 1/(2*FPS). This creates natural motion blur that mimics the human eye's perception. This calculator includes a note about this rule to remind users about frame timing considerations.",
    },
    {
      question: "Can I subtract a larger timecode from a smaller one?",
      answer:
        "Subtracting a larger timecode from a smaller one results in a negative timecode, which is not valid in this calculator. The result will clamp to zero. Always ensure the minuend (first timecode) is equal or larger than the subtrahend (second timecode) to get meaningful results.",
    },
    {
      question: "How do I input timecodes correctly?",
      answer:
        "Input timecodes in the format HH:MM:SS:FF, where HH is hours (0-99), MM is minutes (00-59), SS is seconds (00-59), and FF is frames (00 to FPS-1). Leading zeros are required for minutes, seconds, and frames to ensure proper parsing and calculation.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have a clip starting at timecode 01:00:00:00 and want to add a duration of 00:10:15:12 at 24 FPS to find the end timecode.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Input the start timecode as 01:00:00:00 and the duration as 00:10:15:12.",
      },
      {
        label: "Step 2",
        explanation: "Set the FPS to 24, matching your footage frame rate.",
      },
      {
        label: "Step 3",
        explanation: "Select the 'Add' operation and click Calculate.",
      },
    ],
    result:
      "The calculator outputs 01:10:15:12, which is the end timecode after adding the duration at 24 FPS.",
  };

  const references = [
    {
      title: "Timecode - Wikipedia",
      description:
        "Comprehensive overview of timecode usage in video and audio production.",
      url: "https://en.wikipedia.org/wiki/Timecode",
    },
    {
      title: "Understanding Frame Rates and Timecode",
      description:
        "Detailed explanation of frame rates, timecode formats, and their importance in video production.",
      url: "https://www.videomaker.com/article/c10/18684-understanding-frame-rates-and-timecode",
    },
    {
      title: "The 180 Degree Shutter Rule Explained",
      description:
        "A guide to the 180-degree shutter rule and its impact on motion blur and video quality.",
      url: "https://www.premiumbeat.com/blog/180-degree-shutter-rule/",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="timecode1">Timecode 1 (HH:MM:SS:FF)</Label>
          <Input
            id="timecode1"
            placeholder="01:23:45:12"
            value={inputs.timecode1}
            onChange={(e) => handleInputChange("timecode1", e.target.value)}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="timecode2">Timecode 2 (HH:MM:SS:FF)</Label>
          <Input
            id="timecode2"
            placeholder="00:10:00:00"
            value={inputs.timecode2}
            onChange={(e) => handleInputChange("timecode2", e.target.value)}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fps">Frames Per Second (FPS)</Label>
          <Input
            id="fps"
            type="number"
            min={1}
            max={120}
            step={0.001}
            value={inputs.fps}
            onChange={(e) => handleInputChange("fps", e.target.value)}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button
          variant={inputs.operation === "add" ? "default" : "outline"}
          onClick={() => handleInputChange("operation", "add")}
          className="flex-1"
          aria-pressed={inputs.operation === "add"}
          aria-label="Add timecodes"
        >
          Add
        </Button>
        <Button
          variant={inputs.operation === "subtract" ? "default" : "outline"}
          onClick={() => handleInputChange("operation", "subtract")}
          className="flex-1"
          aria-pressed={inputs.operation === "subtract"}
          aria-label="Subtract timecodes"
        >
          Subtract
        </Button>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" disabled>
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
            <Separator className="my-3" />
            <p className="text-xs text-slate-400 italic">{results.feedback}</p>
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
            Enter the first timecode in the format <code>HH:MM:SS:FF</code>. For
            example, <code>01:23:45:12</code>.
          </li>
          <li>
            Enter the second timecode you want to add or subtract in the same
            format.
          </li>
          <li>
            Specify the frames per second (FPS) of your footage. Common values
            include 24, 25, 29.97, 30, 60, etc.
          </li>
          <li>
            Choose whether you want to add or subtract the second timecode from
            the first by clicking the corresponding button.
          </li>
          <li>
            The result will be displayed below, showing the resulting timecode
            and calculation details.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Timecode Addition/Subtraction Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            Timecode is a fundamental concept in video and audio production,
            providing a precise way to identify every frame in a sequence. It is
            expressed in the format <code>HH:MM:SS:FF</code>, where hours,
            minutes, and seconds are followed by frames. The number of frames
            per second (FPS) varies depending on the video standard, such as 24
            FPS for film or 30 FPS for NTSC video.
          </p>
          <p>
            This calculator allows professionals to add or subtract two timecodes
            accurately by converting them into total frames based on the FPS,
            performing the arithmetic, and then converting the result back into
            timecode format. This is essential for tasks like determining clip
            durations, syncing footage, or calculating offsets.
          </p>
          <p>
            The 180-degree shutter rule, referenced in the results, is a
            cinematography guideline that suggests the shutter speed should be
            set to double the frame rate to achieve natural motion blur. While
            this calculator focuses on timecode math, understanding shutter
            speed in relation to FPS is important for overall video quality and
            timing.
          </p>
          <p>
            When using this tool, ensure your timecodes are correctly formatted
            and that the FPS matches your footage settings. Incorrect FPS or
            invalid timecodes can lead to inaccurate results. The calculator
            also prevents negative timecodes by clamping subtraction results to
            zero, as negative timecodes are not valid in most workflows.
          </p>
          <p>
            Whether you are in production, post-production, or broadcasting,
            this calculator helps streamline your workflow by providing quick
            and reliable timecode arithmetic, saving time and reducing errors.
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
            <strong>Warning:</strong> Entering timecodes in an incorrect format
            (e.g., missing leading zeros or wrong separators) will cause parsing
            errors and invalid results.
          </p>
          <p>
            <strong>Warning:</strong> Using an FPS value that does not match your
            footage will produce inaccurate timecode calculations.
          </p>
          <p>
            <strong>Warning:</strong> Subtracting a larger timecode from a
            smaller one results in zero, which might not be the intended
            outcome.
          </p>
          <p>
            <strong>Warning:</strong> Frames entered must be less than the FPS
            value; otherwise, the timecode is invalid.
          </p>
          <p>
            <strong>Warning:</strong> Forgetting to select the correct operation
            (add or subtract) can lead to unexpected results.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            <strong>Scenario:</strong> You have a clip starting at timecode{" "}
            <code>01:00:00:00</code> and want to add a duration of{" "}
            <code>00:10:15:12</code> at 24 FPS to find the end timecode.
          </p>
          <ol>
            <li>
              Input the start timecode as <code>01:00:00:00</code> and the
              duration as <code>00:10:15:12</code>.
            </li>
            <li>Set the FPS to 24, matching your footage frame rate.</li>
            <li>Select the "Add" operation and click Calculate.</li>
          </ol>
          <p>
            <strong>Result:</strong> The calculator outputs{" "}
            <code>01:10:15:12</code>, which is the end timecode after adding the
            duration at 24 FPS.
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
      title="Timecode Addition/Subtraction Calculator"
      description="Professional video & audio calculator: Timecode Addition/Subtraction Calculator. Accurate technical formulas for production, post-production, and broadcasting."
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