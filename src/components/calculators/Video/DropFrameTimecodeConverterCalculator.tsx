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

function parseTimecode(tc: string) {
  // Parse HH:MM:SS:FF format
  const parts = tc.split(":");
  if (parts.length !== 4) return null;
  const [hh, mm, ss, ff] = parts.map((v) => parseInt(v, 10));
  if (
    [hh, mm, ss, ff].some(
      (n) => isNaN(n) || n < 0 || !Number.isInteger(n)
    )
  )
    return null;
  if (mm > 59 || ss > 59) return null;
  return { hh, mm, ss, ff };
}

function framesToTimecodeDropFrame(totalFrames: number, fps: number) {
  // Drop-frame timecode calculation for 29.97 or 59.94 fps (or multiples)
  // Only valid for 29.97 and 59.94 fps drop frame.
  // For other fps, return standard timecode.

  if (fps !== 29.97 && fps !== 59.94) {
    // Non-drop frame fps, just convert frames to timecode normally
    const framesPerSecond = Math.round(fps);
    const framesPerMinute = framesPerSecond * 60;
    const framesPerHour = framesPerMinute * 60;

    let frames = totalFrames;

    const hh = Math.floor(frames / framesPerHour);
    frames -= hh * framesPerHour;
    const mm = Math.floor(frames / framesPerMinute);
    frames -= mm * framesPerMinute;
    const ss = Math.floor(frames / framesPerSecond);
    frames -= ss * framesPerSecond;
    const ff = frames;

    return { hh, mm, ss, ff };
  }

  // Drop frame calculation for 29.97 or 59.94 fps
  // Reference: SMPTE RP-155 and SMPTE 12M-1999

  // Round fps to nearest integer for calculations
  const roundedFPS = Math.round(fps);

  // Number of dropped frames per minute except every 10th minute
  const dropFrames = Math.round(fps * 0.066666); // 2 for 29.97, 4 for 59.94

  const framesPerHour = roundedFPS * 60 * 60;
  const framesPer24Hours = framesPerHour * 24;
  const framesPer10Minutes = roundedFPS * 60 * 10 - dropFrames * 9;

  totalFrames = totalFrames % framesPer24Hours;

  let d = Math.floor(totalFrames / framesPer10Minutes);
  let m = totalFrames % framesPer10Minutes;

  let totalMinutes = d * 10 + Math.floor(m / (roundedFPS * 60 - dropFrames));
  let framesInMinute = m % (roundedFPS * 60 - dropFrames);

  let hh = Math.floor(totalMinutes / 60);
  let mm = totalMinutes % 60;
  let ss = Math.floor(framesInMinute / roundedFPS);
  let ff = framesInMinute % roundedFPS;

  return { hh, mm, ss, ff };
}

function timecodeToFramesDropFrame(tc: { hh: number; mm: number; ss: number; ff: number }, fps: number) {
  // Convert drop-frame timecode to total frames
  // Only valid for 29.97 or 59.94 fps drop frame.
  // For other fps, use non-drop frame calculation.

  const { hh, mm, ss, ff } = tc;

  if (fps !== 29.97 && fps !== 59.94) {
    // Non-drop frame calculation
    const framesPerSecond = Math.round(fps);
    return (
      hh * 3600 * framesPerSecond +
      mm * 60 * framesPerSecond +
      ss * framesPerSecond +
      ff
    );
  }

  // Drop frame calculation
  const roundedFPS = Math.round(fps);
  const dropFrames = Math.round(fps * 0.066666); // 2 for 29.97, 4 for 59.94

  const totalMinutes = hh * 60 + mm;
  const framesPerHour = roundedFPS * 60 * 60;
  const framesPer24Hours = framesPerHour * 24;
  const framesPer10Minutes = roundedFPS * 60 * 10 - dropFrames * 9;

  let d = Math.floor(totalMinutes / 10);
  let m = totalMinutes % 10;

  let totalDroppedFrames = dropFrames * (totalMinutes - d);

  let totalFrames =
    hh * 3600 * roundedFPS +
    mm * 60 * roundedFPS +
    ss * roundedFPS +
    ff -
    totalDroppedFrames;

  // Clamp to 24h max
  totalFrames = totalFrames % framesPer24Hours;

  return totalFrames;
}

function formatTimecode(tc: { hh: number; mm: number; ss: number; ff: number }) {
  const pad2 = (n: number) => n.toString().padStart(2, "0");
  return `${pad2(tc.hh)}:${pad2(tc.mm)}:${pad2(tc.ss)}:${pad2(tc.ff)}`;
}

export default function DropFrameTimecodeConverterCalculator() {
  const [inputs, setInputs] = useState({
    timecode: "",
    fps: "29.97",
    convertToFrames: true,
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const fpsOptions: { [key: string]: string } = {
    "23.976": "23.976",
    "24": "24",
    "25": "25",
    "29.97": "29.97 (Drop Frame)",
    "30": "30",
    "50": "50",
    "59.94": "59.94 (Drop Frame)",
    "60": "60",
  };

  const results = useMemo(() => {
    const fpsNum = parseFloat(inputs.fps);
    if (isNaN(fpsNum) || fpsNum <= 0) {
      return {
        primary: "Invalid FPS",
        secondary: "",
        details: "Please enter a valid frames per second value.",
        feedback: "",
      };
    }

    if (inputs.convertToFrames) {
      // Convert timecode to frames
      const tc = parseTimecode(inputs.timecode);
      if (!tc) {
        return {
          primary: "Invalid Timecode",
          secondary: "",
          details:
            "Please enter timecode in HH:MM:SS:FF format with valid numbers.",
          feedback: "",
        };
      }
      // Validate frame number within fps range
      if (tc.ff >= Math.ceil(fpsNum)) {
        return {
          primary: "Invalid Frame Number",
          secondary: "",
          details: `Frame number must be less than ${Math.ceil(fpsNum)} for the selected FPS.`,
          feedback: "",
        };
      }

      const totalFrames = timecodeToFramesDropFrame(tc, fpsNum);

      return {
        primary: totalFrames.toString(),
        secondary: "Total Frames",
        details: `Timecode ${inputs.timecode} at ${fpsNum} fps equals ${totalFrames} frames.`,
        feedback:
          "Use this frame count for editing, syncing, or logging precise frame positions.",
      };
    } else {
      // Convert frames to timecode
      const frames = parseInt(inputs.timecode, 10);
      if (isNaN(frames) || frames < 0) {
        return {
          primary: "Invalid Frame Count",
          secondary: "",
          details: "Please enter a non-negative integer for frames.",
          feedback: "",
        };
      }
      const tc = framesToTimecodeDropFrame(frames, fpsNum);
      const formattedTC = formatTimecode(tc);
      return {
        primary: formattedTC,
        secondary: "Timecode (HH:MM:SS:FF)",
        details: `Frame count ${frames} at ${fpsNum} fps converts to timecode ${formattedTC}.`,
        feedback:
          "Use this timecode to locate exact frames in your timeline or footage.",
      };
    }
  }, [inputs]);

  const faqs = [
    {
      question: "What is drop frame timecode and why is it used?",
      answer:
        "Drop frame timecode is a method used to keep timecode in sync with real elapsed time when working with video formats like 29.97 fps. Because 29.97 fps is slightly slower than 30 fps, drop frame timecode periodically skips frame numbers (not actual frames) to correct the timing discrepancy. This ensures that the timecode matches the actual clock time, which is critical for broadcast and professional video workflows.",
    },
    {
      question: "Can I use drop frame timecode with any frame rate?",
      answer:
        "Drop frame timecode is specifically designed for frame rates that are close to but not exactly whole numbers, such as 29.97 fps and 59.94 fps. It is not applicable or necessary for standard whole-number frame rates like 24, 25, or 30 fps. Using drop frame timecode with unsupported frame rates can cause incorrect timing and should be avoided.",
    },
    {
      question: "How do I know if my footage uses drop frame timecode?",
      answer:
        "Typically, footage shot or broadcast at 29.97 fps or 59.94 fps uses drop frame timecode. You can check your editing software or camera metadata to see if drop frame timecode is enabled. Additionally, drop frame timecode timecodes will skip certain frame numbers at the start of each minute except every tenth minute, which can be observed in the timecode display.",
    },
    {
      question: "What is the difference between drop frame and non-drop frame timecode?",
      answer:
        "Non-drop frame timecode counts every frame sequentially without skipping any frame numbers, which can cause the timecode to drift from real time when using fractional frame rates like 29.97 fps. Drop frame timecode corrects this drift by skipping specific frame numbers, ensuring the timecode stays aligned with real elapsed time. This distinction is important for broadcast and precise editing workflows.",
    },
    {
      question: "Why does this calculator have an option to convert frames to timecode and vice versa?",
      answer:
        "In video production and post-production, professionals often need to convert between frame counts and timecode for accurate editing, logging, and synchronization. This calculator allows you to convert a given timecode to the total number of frames or convert a frame count back into a timecode format, supporting workflows that require precise frame-level accuracy.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have a timecode of 01:00:00:00 at 29.97 fps drop frame and want to find out how many frames this represents.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Enter the timecode '01:00:00:00' in the timecode input field.",
      },
      {
        label: "Step 2",
        explanation: "Select '29.97 (Drop Frame)' as the FPS.",
      },
      {
        label: "Step 3",
        explanation:
          "Ensure the calculator is set to convert timecode to frames.",
      },
      {
        label: "Step 4",
        explanation: "Click the Calculate button.",
      },
    ],
    result:
      "The calculator will output 107892 frames, which is the exact frame count for one hour of 29.97 fps drop frame video.",
  };

  const references = [
    {
      title: "SMPTE Time Code Standards",
      description:
        "Official standards and explanations of timecode formats including drop frame timecode.",
      url: "https://ieeexplore.ieee.org/document/4109341",
    },
    {
      title: "Understanding Drop Frame Timecode",
      description:
        "Detailed article explaining the concept and usage of drop frame timecode in video production.",
      url: "https://www.videomaker.com/article/c10/18999-understanding-drop-frame-timecode",
    },
    {
      title: "Avid Media Composer Drop Frame Timecode Guide",
      description:
        "Practical guide on how drop frame timecode works in professional editing software.",
      url: "https://www.avid.com/learn-and-support/drop-frame-timecode",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="w-full md:w-2/3 space-y-2">
          <Label htmlFor="timecodeInput">
            {inputs.convertToFrames
              ? "Enter Timecode (HH:MM:SS:FF)"
              : "Enter Frame Count"}
          </Label>
          <Input
            id="timecodeInput"
            type={inputs.convertToFrames ? "text" : "number"}
            placeholder={
              inputs.convertToFrames ? "00:00:00:00" : "e.g. 1000"
            }
            value={inputs.timecode}
            onChange={(e) => handleInputChange("timecode", e.target.value)}
            spellCheck={false}
            autoComplete="off"
          />
        </div>

        <div className="w-full md:w-1/3 space-y-2">
          <Label htmlFor="fpsSelect">Frames Per Second (FPS)</Label>
          <Select
            value={inputs.fps}
            onValueChange={(value) => handleInputChange("fps", value)}
            id="fpsSelect"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select FPS" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(fpsOptions).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button
          variant={inputs.convertToFrames ? "default" : "outline"}
          onClick={() => handleInputChange("convertToFrames", true)}
          className="flex-1"
          aria-pressed={inputs.convertToFrames}
          aria-label="Convert Timecode to Frames"
          type="button"
        >
          Timecode → Frames
        </Button>
        <Button
          variant={!inputs.convertToFrames ? "default" : "outline"}
          onClick={() => handleInputChange("convertToFrames", false)}
          className="flex-1"
          aria-pressed={!inputs.convertToFrames}
          aria-label="Convert Frames to Timecode"
          type="button"
        >
          Frames → Timecode
        </Button>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" type="button">
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
            <p className="mt-2 italic text-sm text-blue-700 dark:text-blue-400">
              {results.feedback}
            </p>
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
            Enter the timecode in <code>HH:MM:SS:FF</code> format or the total
            frame count depending on the conversion direction.
          </li>
          <li>
            Select the frames per second (FPS) that matches your video format.
            Drop frame options are available for 29.97 and 59.94 fps.
          </li>
          <li>
            Choose whether you want to convert timecode to frames or frames to
            timecode by toggling the buttons.
          </li>
          <li>Click the Calculate button to see the result below.</li>
          <li>
            Use the result for accurate editing, logging, or syncing in your
            video projects.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Drop Frame Timecode Converter
        </h2>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            Drop frame timecode is a specialized timecode format used primarily
            in NTSC video systems running at 29.97 frames per second (fps) or
            its multiple 59.94 fps. Unlike standard timecode, which counts every
            frame sequentially, drop frame timecode periodically skips frame
            numbers to keep the timecode aligned with real elapsed time. This
            correction is necessary because 29.97 fps is slightly slower than
            the nominal 30 fps, causing a drift of approximately 3.6 seconds
            every hour if uncorrected.
          </p>
          <p>
            The drop frame method works by omitting the first two frame numbers
            of every minute except every tenth minute. Importantly, no actual
            frames are dropped from the video; only the numbering is adjusted.
            This ensures that the timecode remains synchronized with the clock,
            which is crucial for broadcast, logging, and editing workflows that
            depend on precise timing.
          </p>
          <p>
            When converting between timecode and frames, it is essential to apply
            the drop frame rules correctly. This calculator automates that
            process, allowing you to input a timecode and receive the exact
            frame count or vice versa. It supports common frame rates including
            23.976, 24, 25, 29.97 (drop frame), 30, 50, 59.94 (drop frame), and
            60 fps.
          </p>
          <p>
            Understanding and using drop frame timecode correctly helps avoid
            synchronization errors in editing and broadcasting. This calculator
            is a valuable tool for video engineers, editors, and post-production
            professionals who require accurate frame-level timing conversions.
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
            <strong>Warning:</strong> Confusing drop frame with non-drop frame
            timecode can lead to incorrect frame counts and timing errors,
            especially in broadcast workflows.
          </p>
          <p>
            Entering invalid timecode formats or frame numbers outside the valid
            range for the selected FPS will cause calculation errors.
          </p>
          <p>
            Using drop frame calculations for frame rates other than 29.97 or
            59.94 fps is incorrect and will produce invalid results.
          </p>
          <p>
            Forgetting that drop frame timecode drops frame numbers, not actual
            frames, can cause misunderstandings in editing and logging.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
        <div className="space-y-4 text-slate-700 dark:text-slate-300 max-w-none">
          <p>
            <strong>Scenario:</strong> You have a timecode of{" "}
            <code>01:00:00:00</code> at 29.97 fps drop frame and want to find
            out how many frames this represents.
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Enter the timecode "01:00:00:00" in the timecode input field.</li>
            <li>Select "29.97 (Drop Frame)" as the FPS.</li>
            <li>
              Ensure the calculator is set to convert timecode to frames.
            </li>
            <li>Click the Calculate button.</li>
          </ol>
          <p>
            <strong>Result:</strong> The calculator will output{" "}
            <code>107892</code> frames, which is the exact frame count for one
            hour of 29.97 fps drop frame video.
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
      title="Drop Frame Timecode Converter"
      description="Professional video & audio calculator: Drop Frame Timecode Converter. Accurate technical formulas for production, post-production, and broadcasting."
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