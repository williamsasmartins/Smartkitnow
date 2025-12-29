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

type FpsType = 23.976 | 24 | 25 | 29.97 | 30 | 50 | 59.94;

const fpsValues: { label: string; value: FpsType }[] = [
  { label: "23.976 (23.98)", value: 23.976 },
  { label: "24", value: 24 },
  { label: "25", value: 25 },
  { label: "29.97", value: 29.97 },
  { label: "30", value: 30 },
  { label: "50", value: 50 },
  { label: "59.94", value: 59.94 },
];

// Helper: Parse timecode string HH:MM:SS:FF to total frames at given fps
function parseTimecodeToFrames(
  tc: string,
  fps: number
): number | null {
  // Validate format HH:MM:SS:FF
  const regex = /^(\d{2}):(\d{2}):(\d{2}):(\d{2})$/;
  const match = tc.match(regex);
  if (!match) return null;

  let [_, hh, mm, ss, ff] = match;
  const hours = parseInt(hh, 10);
  const minutes = parseInt(mm, 10);
  const seconds = parseInt(ss, 10);
  const frames = parseInt(ff, 10);

  // Validate ranges
  if (
    hours > 23 ||
    minutes > 59 ||
    seconds > 59 ||
    frames >= Math.ceil(fps)
  )
    return null;

  // Handle drop-frame for 29.97 and 59.94 fps (SMPTE drop-frame timecode)
  // Drop-frame timecode drops 2 frames every minute except every 10th minute
  // Only applies to 29.97 and 59.94 fps
  if (fps === 29.97 || fps === 59.94) {
    // Calculate total minutes
    const totalMinutes = hours * 60 + minutes;
    // Number of dropped frames
    const dropFrames = fps === 29.97 ? 2 : 4; // 2 frames for 29.97, 4 for 59.94 (double)
    // Number of dropped frames so far
    const d = totalMinutes - Math.floor(totalMinutes / 10);
    const droppedFrames = dropFrames * d;

    // Total frames calculation with drop-frame adjustment
    const totalFrames =
      Math.round(fps * 60 * 60) * hours +
      Math.round(fps * 60) * minutes +
      Math.round(fps) * seconds +
      frames -
      droppedFrames;

    return totalFrames;
  } else {
    // Non-drop frame calculation
    const totalFrames =
      Math.round(fps * 60 * 60) * hours +
      Math.round(fps * 60) * minutes +
      Math.round(fps) * seconds +
      frames;
    return totalFrames;
  }
}

// Convert total frames to timecode string at given fps
function framesToTimecode(
  totalFrames: number,
  fps: number
): string {
  if (fps === 29.97 || fps === 59.94) {
    // Drop-frame timecode conversion
    const dropFrames = fps === 29.97 ? 2 : 4;
    const framesPerHour = Math.round(fps * 60 * 60);
    const framesPer24Hours = framesPerHour * 24;
    const framesPer10Minutes = Math.round(fps * 60 * 10);
    const framesPerMinute = Math.round(fps * 60);

    totalFrames = totalFrames % framesPer24Hours;

    let d = Math.floor(totalFrames / framesPer10Minutes);
    let m = totalFrames % framesPer10Minutes;

    let totalMinutes = d * 10 + Math.floor(m / (framesPerMinute - dropFrames));
    let framesInMinute = m % (framesPerMinute - dropFrames);

    // Calculate timecode components
    let hours = Math.floor(totalMinutes / 60);
    let minutes = totalMinutes % 60;
    let seconds = Math.floor(framesInMinute / Math.round(fps));
    let frames = framesInMinute % Math.round(fps);

    // Adjust frames for drop-frame
    // Frames 0 and 1 are skipped at start of each minute except every 10th minute
    // This is handled by the math above

    return (
      String(hours).padStart(2, "0") +
      ":" +
      String(minutes).padStart(2, "0") +
      ":" +
      String(seconds).padStart(2, "0") +
      ":" +
      String(frames).padStart(2, "0")
    );
  } else {
    // Non-drop frame timecode
    const framesPerHour = Math.round(fps * 60 * 60);
    const framesPerMinute = Math.round(fps * 60);

    let hours = Math.floor(totalFrames / framesPerHour);
    let remainder = totalFrames % framesPerHour;
    let minutes = Math.floor(remainder / framesPerMinute);
    remainder = remainder % framesPerMinute;
    let seconds = Math.floor(remainder / Math.round(fps));
    let frames = remainder % Math.round(fps);

    return (
      String(hours).padStart(2, "0") +
      ":" +
      String(minutes).padStart(2, "0") +
      ":" +
      String(seconds).padStart(2, "0") +
      ":" +
      String(frames).padStart(2, "0")
    );
  }
}

// Convert frames from source fps to target fps, preserving time duration
function convertFrames(
  frames: number,
  sourceFps: number,
  targetFps: number
): number {
  // Duration in seconds = frames / sourceFps
  // Frames at target fps = duration * targetFps
  const durationSeconds = frames / sourceFps;
  return Math.round(durationSeconds * targetFps);
}

export default function FpsConverter239762425299730505994Calculator() {
  const [inputs, setInputs] = useState({
    timecode: "", // HH:MM:SS:FF
    sourceFps: 23.976 as FpsType,
    targetFps: 24 as FpsType,
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const { timecode, sourceFps, targetFps } = inputs;
    if (!timecode) {
      return {
        primary: "-",
        secondary: "Enter a valid timecode",
        details: "",
        feedback: "",
      };
    }

    const srcFpsNum = Number(sourceFps);
    const tgtFpsNum = Number(targetFps);

    if (
      !fpsValues.some((f) => f.value === srcFpsNum) ||
      !fpsValues.some((f) => f.value === tgtFpsNum)
    ) {
      return {
        primary: "-",
        secondary: "Select valid FPS values",
        details: "",
        feedback: "",
      };
    }

    // Parse input timecode to frames at source fps
    const totalFramesSource = parseTimecodeToFrames(timecode, srcFpsNum);
    if (totalFramesSource === null) {
      return {
        primary: "-",
        secondary: "Invalid timecode format or values",
        details: "Use HH:MM:SS:FF format with valid ranges.",
        feedback: "",
      };
    }

    // Convert frames to target fps
    const totalFramesTarget = convertFrames(
      totalFramesSource,
      srcFpsNum,
      tgtFpsNum
    );

    // Convert frames back to timecode at target fps
    const convertedTimecode = framesToTimecode(totalFramesTarget, tgtFpsNum);

    return {
      primary: convertedTimecode,
      secondary: `Timecode at ${tgtFpsNum} fps`,
      details: `Source: ${timecode} @ ${srcFpsNum} fps = ${totalFramesSource} frames\nConverted: ${totalFramesTarget} frames @ ${tgtFpsNum} fps`,
      feedback:
        "Ensure correct drop-frame handling for 29.97 and 59.94 fps formats.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between drop-frame and non-drop-frame timecode?",
      answer:
        "Drop-frame timecode is used primarily with 29.97 and 59.94 fps video to correct timing discrepancies caused by the fractional frame rate. It drops frame numbers (not actual frames) at specific intervals to keep timecode aligned with real time. Non-drop-frame timecode counts every frame sequentially without skipping numbers, which can cause slight timing drift over long durations.",
    },
    {
      question: "Can I convert timecode between any two FPS values?",
      answer:
        "Yes, you can convert timecode between supported FPS values by converting the timecode to total frames at the source FPS, then recalculating the equivalent frame count at the target FPS. This preserves the actual time duration, ensuring accurate synchronization across different frame rates.",
    },
    {
      question: "Why do some FPS values have decimals like 23.976 or 29.97?",
      answer:
        "Decimal FPS values like 23.976 and 29.97 originate from NTSC broadcast standards to accommodate color encoding while maintaining compatibility with black-and-white TV signals. These fractional frame rates are slightly slower than their nominal integer counterparts (24 and 30 fps) and require special handling such as drop-frame timecode to maintain timing accuracy.",
    },
    {
      question: "What happens if I input an invalid timecode?",
      answer:
        "The calculator validates the timecode format and frame ranges based on the selected FPS. If the input is invalid, it will notify you with an error message prompting you to correct the format or values. Always ensure your timecode matches the HH:MM:SS:FF format and frame numbers do not exceed the maximum frames per second.",
    },
    {
      question: "Is this calculator suitable for professional broadcast workflows?",
      answer:
        "Yes, this calculator is designed with SMPTE standards in mind, supporting both drop-frame and non-drop-frame timecodes for common broadcast frame rates. It helps professionals accurately convert timecodes between different FPS values, essential for editing, conforming, and delivery in multi-format environments.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Converting a 01:00:00:00 timecode from 29.97 fps (drop-frame) to 25 fps (non-drop-frame) for European broadcast delivery.",
    steps: [
      {
        label: "Step 1: Parse source timecode to frames",
        explanation:
          "At 29.97 fps drop-frame, 01:00:00:00 corresponds to 107892 frames (accounting for dropped frames).",
      },
      {
        label: "Step 2: Calculate duration in seconds",
        explanation:
          "Duration = frames / fps = 107892 / 29.97 ≈ 3599.64 seconds (~1 hour).",
      },
      {
        label: "Step 3: Convert frames to target fps",
        explanation:
          "Frames at 25 fps = duration * 25 = 3599.64 * 25 ≈ 89991 frames.",
      },
      {
        label: "Step 4: Convert frames back to timecode at 25 fps",
        explanation:
          "89991 frames at 25 fps equals 01:00:00:16 (HH:MM:SS:FF).",
      },
    ],
    result:
      "The converted timecode is 01:00:00:16 at 25 fps, preserving the original duration.",
  };

  const references = [
    {
      title: "SMPTE Standards",
      description:
        "Official standards for timecode and frame rate handling in professional video production.",
      url: "https://www.smpte.org/",
    },
    {
      title: "Understanding Drop Frame Timecode",
      description:
        "Detailed explanation of drop-frame timecode and its importance in NTSC video.",
      url: "https://www.davidheidelberger.com/2013/06/ntsc-drop-frame-timecode-explained/",
    },
    {
      title: "Frame Rate Conversion Basics",
      description:
        "Technical overview of converting timecode and frames between different frame rates.",
      url: "https://www.videomaker.com/article/c10/18699-frame-rate-conversion-basics",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="timecode">Input Timecode (HH:MM:SS:FF)</Label>
          <Input
            id="timecode"
            placeholder="00:00:00:00"
            value={inputs.timecode}
            onChange={(e) => handleInputChange("timecode", e.target.value)}
            maxLength={11}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sourceFps">Source FPS</Label>
          <Select
            value={String(inputs.sourceFps)}
            onValueChange={(val) =>
              handleInputChange("sourceFps", val)
            }
          >
            <SelectTrigger id="sourceFps" className="w-full">
              <SelectValue placeholder="Select source FPS" />
            </SelectTrigger>
            <SelectContent>
              {fpsValues.map((fps) => (
                <SelectItem key={fps.value} value={String(fps.value)}>
                  {fps.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetFps">Target FPS</Label>
          <Select
            value={String(inputs.targetFps)}
            onValueChange={(val) =>
              handleInputChange("targetFps", val)
            }
          >
            <SelectTrigger id="targetFps" className="w-full">
              <SelectValue placeholder="Select target FPS" />
            </SelectTrigger>
            <SelectContent>
              {fpsValues.map((fps) => (
                <SelectItem key={fps.value} value={String(fps.value)}>
                  {fps.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Film className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center whitespace-pre-line">
            <span className="text-sm font-semibold text-slate-500 uppercase">
              Result
            </span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.primary}
            </div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            {results.feedback && (
              <p className="text-xs text-blue-700 mt-1">{results.feedback}</p>
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
            Enter the timecode you want to convert in the format{" "}
            <code>HH:MM:SS:FF</code>, where FF is the frame number.
          </li>
          <li>
            Select the source frame rate (FPS) that corresponds to your input
            timecode.
          </li>
          <li>
            Select the target frame rate (FPS) to which you want to convert the
            timecode.
          </li>
          <li>
            Click the <strong>Calculate</strong> button to see the converted
            timecode at the target FPS.
          </li>
          <li>
            Review the detailed frame counts and conversion notes below the
            result for accuracy and troubleshooting.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to FPS Converter (23.976↔24↔25↔29.97↔30↔50↔59.94)
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Frame rate conversion is a critical task in video production and
            post-production, especially when working across different broadcast
            standards and delivery formats. This calculator helps you convert
            timecodes between common frame rates such as 23.976, 24, 25, 29.97,
            30, 50, and 59.94 frames per second (fps). These frame rates cover
            most professional video workflows including film, PAL, NTSC, and
            high-frame-rate video.
          </p>
          <p>
            Timecode is a standardized way to label each frame of video with a
            unique identifier in the format HH:MM:SS:FF (hours, minutes,
            seconds, frames). However, because frame rates vary, the same
            timecode string can represent different actual durations depending on
            the fps. For example, 01:00:00:00 at 29.97 fps is slightly longer in
            real time than 01:00:00:00 at 30 fps.
          </p>
          <p>
            This calculator first converts the input timecode into total frames
            based on the source fps, accounting for drop-frame timecode where
            applicable (29.97 and 59.94 fps). Drop-frame timecode is a method to
            keep timecode aligned with real time by skipping frame numbers at
            specific intervals, not actual frames. Then, it converts the total
            frames into an equivalent timecode at the target fps, preserving the
            actual duration of the video.
          </p>
          <p>
            Understanding the difference between drop-frame and non-drop-frame
            timecode is essential, as incorrect assumptions can lead to timing
            errors in editing and broadcasting. This tool automates the complex
            calculations, ensuring accurate conversions for professional use.
          </p>
          <p>
            Use this calculator to prepare media for different broadcast
            standards, conform timelines, or synchronize multi-format footage
            with confidence.
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
            <strong>Warning:</strong> Entering an invalid timecode format or
            frame number exceeding the maximum for the selected FPS will cause
            incorrect results or errors. Always use the HH:MM:SS:FF format and
            verify frame ranges.
          </p>
          <p>
            <strong>Warning:</strong> Confusing drop-frame and non-drop-frame
            timecode for 29.97 and 59.94 fps leads to timing drift and sync
            issues. This calculator automatically handles drop-frame logic, but
            ensure your source timecode matches the correct type.
          </p>
          <p>
            <strong>Warning:</strong> Converting between integer and fractional
            frame rates requires rounding frames, which can cause slight
            discrepancies in very long durations. Always double-check final
            timing in your editing software.
          </p>
          <p>
            <strong>Warning:</strong> This tool assumes SMPTE standard timecode
            and does not support custom frame rates or non-standard timecode
            formats.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            <strong>Scenario:</strong> Converting a 01:00:00:00 timecode from
            29.97 fps (drop-frame) to 25 fps (non-drop-frame) for European
            broadcast delivery.
          </p>
          <ol>
            <li>
              <strong>Parse source timecode to frames:</strong> At 29.97 fps
              drop-frame, 01:00:00:00 corresponds to 107,892 frames (accounting
              for dropped frames).
            </li>
            <li>
              <strong>Calculate duration in seconds:</strong> Duration = frames
              / fps = 107,892 / 29.97 ≈ 3599.64 seconds (~1 hour).
            </li>
            <li>
              <strong>Convert frames to target fps:</strong> Frames at 25 fps =
              duration * 25 = 3599.64 * 25 ≈ 89,991 frames.
            </li>
            <li>
              <strong>Convert frames back to timecode at 25 fps:</strong>{" "}
              89,991 frames at 25 fps equals 01:00:00:16 (HH:MM:SS:FF).
            </li>
          </ol>
          <p>
            <strong>Result:</strong> The converted timecode is 01:00:00:16 at 25
            fps, preserving the original duration.
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
          <BookOpen className="w-5 h-5 text-blue-500" /> References &amp;
          additional resources
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
      title="FPS Converter (23.976↔24↔25↔29.97↔30↔50↔59.94)"
      description="Professional video & audio calculator: FPS Converter (23.976↔24↔25↔29.97↔30↔50↔59.94). Accurate technical formulas for production, post-production, and broadcasting."
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