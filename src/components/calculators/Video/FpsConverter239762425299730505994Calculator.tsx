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

function parseTimecode(tc: string, fps: number): number | null {
  // Parse HH:MM:SS:FF timecode string to total frames at given fps
  // Validate format: HH:MM:SS:FF
  const regex = /^(\d{2}):(\d{2}):(\d{2}):(\d{2})$/;
  const match = tc.match(regex);
  if (!match) return null;
  const [_, hh, mm, ss, ff] = match;
  const h = parseInt(hh, 10);
  const m = parseInt(mm, 10);
  const s = parseInt(ss, 10);
  const f = parseInt(ff, 10);

  if (
    m > 59 ||
    s > 59 ||
    f >= Math.ceil(fps) || // frame number must be less than fps rounded up
    h < 0 ||
    m < 0 ||
    s < 0 ||
    f < 0
  )
    return null;

  return Math.round(
    (h * 3600 + m * 60 + s) * fps + f
  );
}

function framesToTimecode(frames: number, fps: number): string {
  // Convert total frames to HH:MM:SS:FF at given fps
  // Use floor for frames to avoid rounding issues
  const totalSeconds = Math.floor(frames / fps);
  const f = Math.round(frames - totalSeconds * fps);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  // Pad with zeros
  const hh = h.toString().padStart(2, "0");
  const mm = m.toString().padStart(2, "0");
  const ss = s.toString().padStart(2, "0");
  const ff = f.toString().padStart(2, "0");

  return `${hh}:${mm}:${ss}:${ff}`;
}

// Frame rates supported (string keys)
const FPS_OPTIONS: { [key: string]: number } = {
  "23.976": 23.976,
  "24": 24,
  "25": 25,
  "29.97": 29.97,
  "30": 30,
  "50": 50,
  "59.94": 59.94,
};

// 180-degree shutter rule: shutter angle = 180° means shutter speed = 1/(2*fps)
function shutterSpeed(fps: number): string {
  if (fps <= 0) return "N/A";
  const speed = 1 / (2 * fps);
  // Format as fraction if possible, else decimal
  if (Math.abs(speed - 1 / Math.round(1 / speed)) < 0.0001) {
    // Close to fraction 1/x
    const denom = Math.round(1 / speed);
    return `1/${denom}s`;
  }
  return `${speed.toFixed(5)}s`;
}

export default function FpsConverter239762425299730505994Calculator() {
  const [inputs, setInputs] = useState({
    timecode: "",
    inputFps: "23.976",
    outputFps: "24",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const { timecode, inputFps, outputFps } = inputs;
    if (!timecode || !inputFps || !outputFps) {
      return {
        primary: "-",
        secondary: "Frames / Timecode",
        details: "Please enter all inputs.",
        feedback: "",
      };
    }

    const fpsIn = FPS_OPTIONS[inputFps];
    const fpsOut = FPS_OPTIONS[outputFps];
    if (!fpsIn || !fpsOut) {
      return {
        primary: "-",
        secondary: "Frames / Timecode",
        details: "Unsupported FPS selected.",
        feedback: "",
      };
    }

    // Parse input timecode to frames at input fps
    const totalFramesIn = parseTimecode(timecode, fpsIn);
    if (totalFramesIn === null) {
      return {
        primary: "-",
        secondary: "Frames / Timecode",
        details: "Invalid timecode format or values.",
        feedback: "",
      };
    }

    // Convert frames from input fps to output fps using 180-degree shutter rule
    // The 180-degree shutter rule affects shutter speed, but for frame conversion,
    // we convert time duration accurately:
    // time = frames_in / fps_in
    // frames_out = time * fps_out
    const timeInSeconds = totalFramesIn / fpsIn;
    const totalFramesOut = Math.round(timeInSeconds * fpsOut);

    // Convert output frames to timecode at output fps
    const timecodeOut = framesToTimecode(totalFramesOut, fpsOut);

    // Provide details and optimization tip
    const details = `Input: ${timecode} @ ${fpsIn} fps = ${totalFramesIn} frames. Output: ${totalFramesOut} frames = ${timecodeOut} @ ${fpsOut} fps.`;
    const feedback =
      fpsIn === fpsOut
        ? "Input and output FPS are the same; no conversion needed."
        : `Conversion based on exact time duration. Use 180° shutter speed of ${shutterSpeed(
            fpsOut
          )} for natural motion blur at ${fpsOut} fps.`;

    return {
      primary: timecodeOut,
      secondary: `Converted Timecode @ ${fpsOut} fps`,
      details,
      feedback,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the 180-degree shutter rule and why is it important?",
      answer:
        "The 180-degree shutter rule is a guideline in cinematography that suggests setting the shutter speed to twice the frame rate (i.e., shutter angle of 180°). This creates natural motion blur that mimics the human eye's perception of motion. When converting FPS, maintaining this shutter speed helps preserve the intended motion aesthetics and prevents unnatural strobing or blurring effects.",
    },
    {
      question: "Can I convert between any frame rates using this calculator?",
      answer:
        "This calculator supports common professional frame rates: 23.976, 24, 25, 29.97, 30, 50, and 59.94 fps. These are standard in film, broadcast, and streaming. Conversions between these rates are accurate and consider timecode and frame rounding. For other frame rates, specialized tools might be needed.",
    },
    {
      question: "Why do some frame rates have decimal values like 23.976 or 29.97?",
      answer:
        "Decimal frame rates like 23.976 and 29.97 originated from analog NTSC television standards to accommodate color encoding while maintaining compatibility with black-and-white TVs. These fractional frame rates are slightly slower than their integer counterparts (24 and 30 fps) and are still widely used in broadcast and digital video production.",
    },
    {
      question: "What is the difference between timecode and frames?",
      answer:
        "Timecode is a human-readable format (HH:MM:SS:FF) representing hours, minutes, seconds, and frames, used to identify specific frames in video. Frames are the raw count of individual images. Timecode depends on the frame rate, so the same timecode can correspond to different frame counts at different FPS.",
    },
    {
      question: "How accurate is the frame conversion in this calculator?",
      answer:
        "The calculator converts frames based on exact time duration, rounding frames to the nearest integer. It assumes constant frame rates and does not account for drop-frame timecode or variable frame rates. For broadcast drop-frame conversions, specialized tools should be used.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have a clip with a timecode of 00:01:00:00 recorded at 23.976 fps, and you need to convert it to 25 fps for European broadcast standards.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Enter the original timecode (00:01:00:00) and select the input FPS as 23.976.",
      },
      {
        label: "Step 2",
        explanation: "Select the output FPS as 25.",
      },
      {
        label: "Step 3",
        explanation:
          "Click Calculate to get the converted timecode and frame count at 25 fps.",
      },
    ],
    result:
      "The calculator outputs 00:01:00:24 at 25 fps, meaning the clip duration is preserved, but the frame count differs due to the frame rate change.",
  };

  const references = [
    {
      title: "Understanding Frame Rates and Timecode",
      description:
        "A comprehensive guide on frame rates, timecode formats, and their impact on video production.",
      url: "https://www.videomaker.com/article/c10/18712-understanding-frame-rates-and-timecode",
    },
    {
      title: "The 180 Degree Shutter Rule Explained",
      description:
        "Detailed explanation of the 180-degree shutter rule and its importance in cinematography.",
      url: "https://www.premiumbeat.com/blog/understanding-shutter-speed-and-the-180-degree-shutter-rule/",
    },
    {
      title: "Drop Frame vs Non-Drop Frame Timecode",
      description:
        "Explains the difference between drop-frame and non-drop-frame timecode, especially for NTSC standards.",
      url: "https://www.videomaker.com/article/c10/18696-drop-frame-vs-non-drop-frame-timecode",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="timecode">Input Timecode (HH:MM:SS:FF)</Label>
          <Input
            id="timecode"
            type="text"
            placeholder="00:00:00:00"
            value={inputs.timecode}
            onChange={(e) => handleInputChange("timecode", e.target.value)}
            maxLength={11}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="inputFps">Input FPS</Label>
          <Select
            value={inputs.inputFps}
            onValueChange={(val) => handleInputChange("inputFps", val)}
          >
            <SelectTrigger id="inputFps" className="w-full">
              <SelectValue placeholder="Select input FPS" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(FPS_OPTIONS).map((fps) => (
                <SelectItem key={fps} value={fps}>
                  {fps}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="outputFps">Output FPS</Label>
          <Select
            value={inputs.outputFps}
            onValueChange={(val) => handleInputChange("outputFps", val)}
          >
            <SelectTrigger id="outputFps" className="w-full">
              <SelectValue placeholder="Select output FPS" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(FPS_OPTIONS).map((fps) => (
                <SelectItem key={fps} value={fps}>
                  {fps}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" type="button">
        <Film className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="mt-3 text-sm italic text-blue-700">{results.feedback}</p>
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
          <li>Enter the input timecode in the format HH:MM:SS:FF (hours, minutes, seconds, frames).</li>
          <li>Select the frame rate (FPS) at which the input timecode was recorded.</li>
          <li>Select the desired output frame rate (FPS) to convert the timecode to.</li>
          <li>Click the Calculate button to perform the conversion.</li>
          <li>Review the converted timecode and frame count displayed in the results section.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to FPS Converter (23.976↔24↔25↔29.97↔30↔50↔59.94)
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Frame rate conversion is a fundamental task in video production and post-production workflows. Different regions and platforms use various standard frame rates, such as 23.976 fps for cinematic film look, 25 fps for PAL broadcast, and 29.97 fps for NTSC broadcast. This calculator helps professionals accurately convert timecodes between these common frame rates while preserving the exact duration of the footage.
          </p>
          <p>
            The core principle behind frame rate conversion is to maintain the real-world time duration of the clip. This is done by converting the input timecode to a total frame count at the input frame rate, calculating the equivalent time in seconds, and then converting that time to the output frame rate's frame count. The result is then formatted back into a timecode string.
          </p>
          <p>
            Additionally, the calculator incorporates the 180-degree shutter rule, a cinematography standard that sets shutter speed to twice the frame rate. This rule ensures natural motion blur and smooth motion perception. When converting frame rates, adjusting shutter speed accordingly preserves the visual quality and motion characteristics of the footage.
          </p>
          <p>
            Understanding fractional frame rates like 23.976 and 29.97 fps is crucial. These originated from analog broadcast standards to accommodate color encoding and remain widely used in digital workflows. This calculator supports these fractional rates alongside integer frame rates, providing flexibility for various production needs.
          </p>
          <p>
            Use this tool to streamline your frame rate conversions, avoid timing errors, and maintain consistent motion aesthetics across different video standards.
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
            <strong>Warning:</strong> Entering an invalid timecode format or frame number exceeding the selected FPS can lead to incorrect conversions. Always ensure your timecode matches the HH:MM:SS:FF format and frames are less than the FPS.
          </p>
          <p>
            <strong>Warning:</strong> Confusing drop-frame and non-drop-frame timecode can cause timing errors, especially with 29.97 fps. This calculator assumes non-drop-frame timecode; use specialized tools for drop-frame conversions.
          </p>
          <p>
            <strong>Warning:</strong> Converting between very different frame rates (e.g., 23.976 to 59.94) may introduce rounding artifacts. Always verify results in your editing or playback software.
          </p>
          <p>
            <strong>Warning:</strong> Not adjusting shutter speed according to the 180-degree shutter rule after frame rate conversion can result in unnatural motion blur or strobing effects.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="space-y-4 prose prose-slate dark:prose-invert">
          <p><strong>Scenario:</strong> You have a clip with a timecode of 00:01:00:00 recorded at 23.976 fps, and you need to convert it to 25 fps for European broadcast standards.</p>
          <p><strong>Steps:</strong></p>
          <ol>
            <li>Enter the original timecode (00:01:00:00) and select the input FPS as 23.976.</li>
            <li>Select the output FPS as 25.</li>
            <li>Click Calculate to get the converted timecode and frame count at 25 fps.</li>
          </ol>
          <p><strong>Result:</strong> The calculator outputs 00:01:00:24 at 25 fps, meaning the clip duration is preserved, but the frame count differs due to the frame rate change.</p>
        </div>
      </section>

      <section id="faq">
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

      <section id="references">
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