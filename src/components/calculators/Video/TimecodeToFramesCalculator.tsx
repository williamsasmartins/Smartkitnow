import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Film,
  BookOpen,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function parseTimecode(tc: string) {
  // Parse HH:MM:SS:FF format strictly
  const regex = /^(\d{1,2}):(\d{2}):(\d{2}):(\d{2})$/;
  const match = tc.match(regex);
  if (!match) return null;
  const [, hh, mm, ss, ff] = match;
  const h = parseInt(hh, 10);
  const m = parseInt(mm, 10);
  const s = parseInt(ss, 10);
  const f = parseInt(ff, 10);
  if (
    h < 0 ||
    m < 0 ||
    m > 59 ||
    s < 0 ||
    s > 59 ||
    f < 0
  )
    return null;
  return { h, m, s, f };
}

function isValidFps(fps: number) {
  // Common fps values for video production
  const validFps = [
    "23.976",
    "24",
    "25",
    "29.97",
    "30",
    "50",
    "59.94",
    "60",
  ];
  return validFps.includes(fps.toString());
}

function roundToThreeDecimals(num: number) {
  return Math.round(num * 1000) / 1000;
}

export default function TimecodeToFramesCalculator() {
  const [inputs, setInputs] = useState({
    timecode: "",
    fps: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const { timecode, fps } = inputs;
    if (!timecode || !fps) {
      return {
        primary: "0",
        secondary: "Frames",
        details: "Please enter both Timecode and FPS.",
        feedback: "",
      };
    }

    const fpsNum = Number(fps);
    if (isNaN(fpsNum) || fpsNum <= 0) {
      return {
        primary: "0",
        secondary: "Frames",
        details: "FPS must be a positive number.",
        feedback: "",
      };
    }

    const tc = parseTimecode(timecode);
    if (!tc) {
      return {
        primary: "0",
        secondary: "Frames",
        details:
          "Invalid timecode format. Use HH:MM:SS:FF (e.g. 01:23:45:12).",
        feedback: "",
      };
    }

    // Check frame number validity against fps (180 rule)
    // 180 rule: FF < FPS, if FF >= FPS, timecode is invalid
    if (tc.f >= Math.ceil(fpsNum)) {
      return {
        primary: "0",
        secondary: "Frames",
        details: `Frame number (FF) must be less than FPS (${fpsNum}).`,
        feedback: "",
      };
    }

    // Calculate total frames:
    // totalFrames = ((HH * 3600) + (MM * 60) + SS) * FPS + FF
    // For drop-frame or non-integer fps, use exact fps value
    const totalFrames =
      Math.floor(tc.h * 3600 * fpsNum) +
      Math.floor(tc.m * 60 * fpsNum) +
      Math.floor(tc.s * fpsNum) +
      tc.f;

    // Frames to timecode (reverse) for verification
    // Not required here but could be used for feedback

    return {
      primary: totalFrames.toString(),
      secondary: "Frames",
      details: `Timecode ${timecode} at ${fpsNum} FPS equals ${totalFrames} frames.`,
      feedback:
        "Ensure frame number (FF) is always less than FPS to avoid invalid timecodes.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the 180-degree shutter rule in video?",
      answer:
        "The 180-degree shutter rule is a guideline in cinematography that suggests setting the shutter speed to be double the frame rate to achieve natural motion blur. For example, at 24 FPS, the shutter speed should be 1/48th of a second. This rule helps create smooth and cinematic motion in footage.",
    },
    {
      question: "Why must the frame number (FF) be less than the FPS?",
      answer:
        "In timecode notation, the frame number (FF) represents the frame count within a single second and must be less than the frames per second (FPS) value. If FF equals or exceeds FPS, it indicates an invalid timecode because frames reset every second. This ensures accurate synchronization and timing in video editing and playback.",
    },
    {
      question: "Can this calculator handle drop-frame timecode?",
      answer:
        "This calculator is designed for standard non-drop-frame timecode calculations. Drop-frame timecode involves skipping certain frame numbers to maintain sync with real time in NTSC video formats and requires specialized handling. For drop-frame calculations, dedicated tools or formulas should be used.",
    },
    {
      question: "How do I convert frames back to timecode?",
      answer:
        "To convert frames back to timecode, divide the total frames by the FPS to get total seconds, then calculate hours, minutes, seconds, and remaining frames. This reverse calculation helps verify frame counts and synchronize edits accurately.",
    },
    {
      question: "What FPS values are commonly used in video production?",
      answer:
        "Common FPS values include 23.976, 24, 25, 29.97, 30, 50, 59.94, and 60. These correspond to different broadcast standards and cinematic frame rates. Choosing the correct FPS is essential for compatibility and desired motion aesthetics.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have a timecode of 01:00:00:15 and want to find out how many frames this represents at 30 FPS.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Enter the timecode 01:00:00:15 into the Timecode input field.",
      },
      {
        label: "Step 2",
        explanation: "Enter 30 into the FPS input field.",
      },
      {
        label: "Step 3",
        explanation: "Click the Calculate button to get the total frames.",
      },
    ],
    result:
      "The calculator outputs 1080015 frames, meaning 1 hour, 0 minutes, 0 seconds, and 15 frames at 30 FPS equals 1,080,015 frames total.",
  };

  const references = [
    {
      title: "Understanding Timecode and Frame Rates",
      description:
        "A comprehensive guide on timecode formats, frame rates, and their applications in video production.",
      url: "https://www.videomaker.com/article/c10/18781-understanding-timecode-and-frame-rates",
    },
    {
      title: "The 180 Degree Shutter Rule Explained",
      description:
        "An article explaining the 180-degree shutter rule and its importance in cinematography.",
      url: "https://www.premiumbeat.com/blog/180-degree-shutter-rule/",
    },
    {
      title: "Drop-Frame vs Non-Drop-Frame Timecode",
      description:
        "Detailed explanation of drop-frame and non-drop-frame timecode formats and when to use each.",
      url: "https://www.videomaker.com/article/c10/18641-drop-frame-vs-non-drop-frame-timecode",
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
            placeholder="e.g. 01:23:45:12"
            value={inputs.timecode}
            onChange={(e) => handleInputChange("timecode", e.target.value)}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fps">Frames Per Second (FPS)</Label>
          <Input
            id="fps"
            type="number"
            min="1"
            step="any"
            placeholder="e.g. 24 or 29.97"
            value={inputs.fps}
            onChange={(e) => handleInputChange("fps", e.target.value)}
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
            {results.feedback && (
              <>
                <Separator className="my-3" />
                <p className="text-sm italic text-slate-600 dark:text-slate-400">
                  {results.feedback}
                </p>
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
          <li>
            Enter the timecode in the format <code>HH:MM:SS:FF</code>, where HH
            is hours, MM is minutes, SS is seconds, and FF is frames.
          </li>
          <li>
            Enter the frames per second (FPS) value that corresponds to your
            video footage (e.g., 24, 29.97, 30).
          </li>
          <li>
            Click the <strong>Calculate</strong> button to convert the timecode
            to total frames.
          </li>
          <li>
            Review the result displayed below the button, which shows the total
            number of frames for the given timecode and FPS.
          </li>
          <li>
            Use the feedback and details to verify your inputs and ensure
            accuracy.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Timecode to Frames Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Timecode is a fundamental concept in video production and post-production,
            representing a precise timestamp in hours, minutes, seconds, and frames.
            Converting timecode to frames is essential for editing, syncing audio,
            and managing footage accurately. This calculator simplifies that process
            by allowing you to input a timecode and the frames per second (FPS) of
            your video, then outputs the total number of frames.
          </p>
          <p>
            The calculation is straightforward: the total frames are computed by
            multiplying the hours, minutes, and seconds by the FPS and then adding
            the frame count within the current second. For example, a timecode of
            00:01:00:15 at 30 FPS means 1 minute and 15 frames, which converts to
            (60 * 30) + 15 = 1815 frames.
          </p>
          <p>
            It is crucial to ensure that the frame number (FF) is always less than
            the FPS value, following the 180-degree shutter rule and standard
            timecode formatting. If the frame number exceeds or equals the FPS,
            the timecode is invalid and will produce incorrect results.
          </p>
          <p>
            This tool is invaluable for video engineers, editors, and DITs who need
            precise frame counts for conforming edits, calculating durations, or
            troubleshooting sync issues. Understanding how to convert between
            timecode and frames also aids in better communication across production
            teams and ensures technical accuracy in workflows.
          </p>
          <p>
            Remember, this calculator handles standard non-drop-frame timecode.
            Drop-frame timecode, used primarily in NTSC video, requires additional
            calculations to maintain sync with real time and is not covered here.
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
            <strong>Warning:</strong> Entering an invalid timecode format (not
            HH:MM:SS:FF) will cause errors. Always use two digits for minutes,
            seconds, and frames, and one or two digits for hours.
          </p>
          <p>
            <strong>Warning:</strong> The frame number (FF) must be less than the
            FPS value. For example, at 24 FPS, FF cannot be 24 or higher.
          </p>
          <p>
            <strong>Warning:</strong> Using drop-frame timecode values without
            proper handling will yield incorrect frame counts. This calculator does
            not support drop-frame timecode.
          </p>
          <p>
            <strong>Warning:</strong> Ensure FPS is a positive number and matches
            your footage's frame rate exactly for accurate results.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
        <div className="space-y-4 text-slate-700 dark:text-slate-300">
          <p>
            <strong>Scenario:</strong> You have a timecode of 01:00:00:15 and want
            to find out how many frames this represents at 30 FPS.
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            {example.steps.map((step, i) => (
              <li key={i}>
                <strong>{step.label}:</strong> {step.explanation}
              </li>
            ))}
          </ol>
          <p>
            <strong>Result:</strong> The calculator outputs{" "}
            <code>1080015</code> frames, meaning 1 hour, 0 minutes, 0 seconds, and
            15 frames at 30 FPS equals 1,080,015 frames total.
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
      title="Timecode to Frames Calculator"
      description="Professional video & audio calculator: Timecode to Frames Calculator. Accurate technical formulas for production, post-production, and broadcasting."
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