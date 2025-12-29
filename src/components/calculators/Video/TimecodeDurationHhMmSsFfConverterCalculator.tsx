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
  // Parse HH:MM:SS:FF format strictly
  const regex = /^(\d{1,2}):(\d{2}):(\d{2}):(\d{2})$/;
  const match = tc.match(regex);
  if (!match) return null;
  const [_, hh, mm, ss, ff] = match;
  const H = parseInt(hh, 10);
  const M = parseInt(mm, 10);
  const S = parseInt(ss, 10);
  const F = parseInt(ff, 10);
  if (
    H < 0 ||
    M < 0 || M > 59 ||
    S < 0 || S > 59 ||
    F < 0
  ) return null;
  return { H, M, S, F };
}

function pad2(num: number) {
  return num.toString().padStart(2, "0");
}

export default function TimecodeDurationHhMmSsFfConverterCalculator() {
  const [inputs, setInputs] = useState({
    timecode: "",
    fps: "",
    direction: "tc-to-duration", // or "duration-to-tc"
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const fpsNum = parseFloat(inputs.fps);
    if (isNaN(fpsNum) || fpsNum <= 0) {
      return {
        primary: "Invalid FPS",
        secondary: "",
        details: "Please enter a valid positive FPS value.",
        feedback: "",
      };
    }

    if (inputs.direction === "tc-to-duration") {
      // Input is timecode, output duration in frames and total frames
      const tc = parseTimecode(inputs.timecode);
      if (!tc) {
        return {
          primary: "Invalid Timecode",
          secondary: "",
          details: "Timecode must be in HH:MM:SS:FF format with valid ranges.",
          feedback: "",
        };
      }
      const { H, M, S, F } = tc;
      if (F >= Math.floor(fpsNum)) {
        return {
          primary: "Invalid Frame Number",
          secondary: "",
          details: `Frame number (FF) must be less than FPS (${Math.floor(fpsNum)}).`,
          feedback: "",
        };
      }
      // Total frames calculation
      const totalFrames = Math.round(
        ((H * 3600 + M * 60 + S) * fpsNum) + F
      );
      // Duration in HH:MM:SS:FF is same as input, but we can show total frames
      return {
        primary: totalFrames.toString(),
        secondary: "Total Frames",
        details: `Timecode ${inputs.timecode} at ${fpsNum} FPS equals ${totalFrames} frames.`,
        feedback: "Use this total frames count for editing or syncing.",
      };
    } else {
      // Input is duration in frames (number), output timecode HH:MM:SS:FF
      const framesInput = parseInt(inputs.timecode, 10);
      if (isNaN(framesInput) || framesInput < 0) {
        return {
          primary: "Invalid Frames",
          secondary: "",
          details: "Please enter a valid non-negative integer for frames.",
          feedback: "",
        };
      }
      // Convert frames to timecode
      const totalSeconds = framesInput / fpsNum;
      const H = Math.floor(totalSeconds / 3600);
      const M = Math.floor((totalSeconds % 3600) / 60);
      const S = Math.floor(totalSeconds % 60);
      const fractionalFrame = totalSeconds - Math.floor(totalSeconds);
      const F = Math.round(fractionalFrame * fpsNum);
      // Adjust if F == fpsNum (rounding)
      const FF = F === Math.floor(fpsNum) ? 0 : F;
      const HH = FF === 0 && F === Math.floor(fpsNum) ? H + 1 : H;
      return {
        primary: `${pad2(HH)}:${pad2(M)}:${pad2(S)}:${pad2(FF)}`,
        secondary: "Timecode (HH:MM:SS:FF)",
        details: `${framesInput} frames at ${fpsNum} FPS equals timecode ${pad2(HH)}:${pad2(M)}:${pad2(S)}:${pad2(FF)}.`,
        feedback: "Use this timecode for logging or timeline reference.",
      };
    }
  }, [inputs]);

  const faqs = [
    {
      question: "What is timecode and why is it important?",
      answer:
        "Timecode is a sequence of numeric codes generated at regular intervals to uniquely identify each frame in video or audio media. It is essential for synchronization, editing, and logging in professional video production. SMPTE timecode format (HH:MM:SS:FF) is widely used to ensure precise frame-accurate referencing across devices and software.",
    },
    {
      question: "How does FPS affect timecode calculations?",
      answer:
        "FPS (frames per second) defines how many frames are displayed or recorded each second. Timecode calculations depend on FPS to convert between frame counts and time durations accurately. Using the correct FPS ensures synchronization and prevents timing errors in editing and playback.",
    },
    {
      question: "What is the difference between drop-frame and non-drop-frame timecode?",
      answer:
        "Drop-frame timecode adjusts the frame count to compensate for the slight difference between the nominal frame rate (e.g., 29.97 fps) and real time, by skipping frame numbers at specific intervals. Non-drop-frame counts every frame sequentially. This calculator assumes standard non-drop-frame timecode for simplicity.",
    },
    {
      question: "Can I use this calculator for audio timecode?",
      answer:
        "Yes, as long as the audio is synchronized with video frames and uses SMPTE timecode format, this calculator can convert between timecode and duration frames. However, audio sample rates differ from video FPS, so ensure you are working with frame-based timecode for accurate results.",
    },
    {
      question: "Why is frame number (FF) limited by FPS?",
      answer:
        "The frame number (FF) represents the frame count within a single second and must be less than the FPS value. For example, at 30 FPS, FF ranges from 00 to 29. Exceeding this range is invalid and indicates an incorrect timecode input.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Calculating total frames for a 2-hour video clip recorded at 24 FPS.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Convert the duration 2 hours into seconds: 2 hours × 3600 seconds/hour = 7200 seconds.",
      },
      {
        label: "Step 2",
        explanation:
          "Multiply total seconds by FPS to get total frames: 7200 seconds × 24 FPS = 172,800 frames.",
      },
      {
        label: "Step 3",
        explanation:
          "Express total frames as timecode: 172,800 frames / 24 FPS = 2:00:00:00 (HH:MM:SS:FF).",
      },
    ],
    result:
      "A 2-hour video at 24 FPS contains exactly 172,800 frames, corresponding to timecode 02:00:00:00.",
  };

  const references = [
    {
      title: "SMPTE Standards",
      description: "Official standards for timecode and video synchronization.",
      url: "https://www.smpte.org/",
    },
    {
      title: "Understanding Timecode",
      description:
        "A detailed guide on timecode formats, drop-frame vs non-drop-frame, and usage.",
      url: "https://www.videomaker.com/article/c10/18718-understanding-timecode",
    },
    {
      title: "Frame Rates Explained",
      description:
        "Comprehensive explanation of frame rates and their impact on video production.",
      url: "https://www.videomaker.com/article/c10/18804-frame-rates-explained",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select
          value={inputs.direction}
          onValueChange={(val) => handleInputChange("direction", val)}
          className="w-48"
        >
          <SelectTrigger>
            <SelectValue>
              {inputs.direction === "tc-to-duration"
                ? "Timecode → Frames"
                : "Frames → Timecode"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tc-to-duration">Timecode → Frames</SelectItem>
            <SelectItem value="duration-to-tc">Frames → Timecode</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>
            {inputs.direction === "tc-to-duration"
              ? "Timecode (HH:MM:SS:FF)"
              : "Total Frames (integer)"}
          </Label>
          <Input
            type={inputs.direction === "tc-to-duration" ? "text" : "number"}
            placeholder={
              inputs.direction === "tc-to-duration"
                ? "e.g. 01:23:45:12"
                : "e.g. 12345"
            }
            value={inputs.timecode}
            onChange={(e) => handleInputChange("timecode", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Frames Per Second (FPS)</Label>
          <Input
            type="number"
            min="0.1"
            step="0.01"
            placeholder="e.g. 24, 29.97, 30"
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
              <p className="mt-1 text-xs italic text-slate-400">
                {results.feedback}
              </p>
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
            Select the conversion direction: either <strong>Timecode to Frames</strong> or{" "}
            <strong>Frames to Timecode</strong>.
          </li>
          <li>
            Enter the timecode in <code>HH:MM:SS:FF</code> format (e.g., 01:23:45:12) if converting timecode to frames, or enter the total number of frames if converting frames to timecode.
          </li>
          <li>
            Input the frames per second (FPS) value corresponding to your video or audio project. Common values include 24, 25, 29.97, and 30.
          </li>
          <li>
            Click the <strong>Calculate</strong> button to get the conversion result displayed below.
          </li>
          <li>
            Use the result for editing, logging, or synchronization tasks in your production workflow.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Timecode ↔ Duration (HH:MM:SS:FF) Converter
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Timecode is a fundamental concept in video and audio production, providing a frame-accurate reference system that allows editors, colorists, and sound engineers to synchronize and navigate media precisely. The SMPTE timecode format, expressed as <code>HH:MM:SS:FF</code>, breaks down time into hours, minutes, seconds, and frames, where frames represent the individual images displayed per second.
          </p>
          <p>
            Frames per second (FPS) is a critical parameter that defines how many frames are shown each second. Different production standards use different FPS values — for example, 24 FPS is standard for film, 25 FPS for PAL video, and 29.97 FPS for NTSC video. Accurate conversion between timecode and total frames depends on using the correct FPS value.
          </p>
          <p>
            This calculator allows you to convert timecode to total frames and vice versa, facilitating tasks such as calculating clip durations, syncing footage, or preparing media for editing software. When converting timecode to frames, the calculator multiplies the total seconds by FPS and adds the frame count. Conversely, converting frames to timecode involves dividing the total frames by FPS and formatting the result into hours, minutes, seconds, and frames.
          </p>
          <p>
            It is important to note that this tool assumes standard non-drop-frame timecode for simplicity. Drop-frame timecode, used primarily with 29.97 FPS video, adjusts frame numbering to maintain synchronization with real time and requires more complex calculations.
          </p>
          <p>
            By understanding and utilizing this converter, professionals can ensure precise timing and synchronization in their workflows, reducing errors and improving efficiency in post-production and broadcasting environments.
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
            <strong>Warning:</strong> Entering an invalid timecode format or frame number exceeding the FPS value will cause incorrect calculations. Always ensure the timecode follows the <code>HH:MM:SS:FF</code> format with frames less than FPS.
          </p>
          <p>
            Using the wrong FPS value for your project can lead to synchronization errors. Double-check your source material's frame rate before converting.
          </p>
          <p>
            Confusing drop-frame and non-drop-frame timecode formats can cause timing mismatches. This calculator does not support drop-frame timecode calculations.
          </p>
          <p>
            When converting frames to timecode, rounding errors may occur if fractional frames are present. This tool rounds frames to the nearest integer frame.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>{example.scenario}</p>
          <ol className="list-decimal pl-5 space-y-2">
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

      <section id="faq">
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

      <section id="references">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-5 h-5 text-blue-500" /> References & additional
          resources
        </h2>
        <div className="space-y-4">
          {references.map((ref, i) => (
            <div key={i}>
              <a
                href={ref.url}
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
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
      title="Timecode ↔ Duration (HH:MM:SS:FF) Converter"
      description="Professional video & audio calculator: Timecode ↔ Duration (HH:MM:SS:FF) Converter. Accurate technical formulas for production, post-production, and broadcasting."
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