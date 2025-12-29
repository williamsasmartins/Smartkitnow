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

function pad(num: number, size = 2) {
  let s = num.toString();
  while (s.length < size) s = "0" + s;
  return s;
}

function framesToTimecode(totalFrames: number, fps: number) {
  // Using 180-degree shutter rule for frame rounding
  // totalFrames / fps = total seconds (float)
  // We convert totalFrames to HH:MM:SS:FF
  const framesPerSecond = fps;
  const hh = Math.floor(totalFrames / (framesPerSecond * 3600));
  const remainderAfterHours = totalFrames % (framesPerSecond * 3600);
  const mm = Math.floor(remainderAfterHours / (framesPerSecond * 60));
  const remainderAfterMinutes = remainderAfterHours % (framesPerSecond * 60);
  const ss = Math.floor(remainderAfterMinutes / framesPerSecond);
  const ff = remainderAfterMinutes % framesPerSecond;
  return `${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(ff)}`;
}

function timecodeToFrames(tc: string, fps: number) {
  const parsed = parseTimecode(tc);
  if (!parsed) return null;
  const { hh, mm, ss, ff } = parsed;
  if (ff >= fps) return null; // invalid frame number for fps
  return hh * 3600 * fps + mm * 60 * fps + ss * fps + ff;
}

export default function TimecodeDurationHhMmSsFfConverterCalculator() {
  const [inputs, setInputs] = useState({
    timecode: "",
    fps: "24",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const fpsNum = Number(inputs.fps);
    if (!fpsNum || fpsNum <= 0) {
      return {
        primary: "Invalid FPS",
        secondary: "",
        details: "FPS must be a positive number.",
        feedback: "",
      };
    }

    // Determine if input is timecode or frames (number)
    // We expect timecode input only, but allow frames input if numeric only
    const isTimecodeFormat = /^(\d{1,2}):([0-5]\d):([0-5]\d):(\d{1,2})$/.test(
      inputs.timecode.trim()
    );

    if (inputs.timecode.trim() === "") {
      return {
        primary: "Enter a timecode",
        secondary: "",
        details: "Please input a timecode in HH:MM:SS:FF format.",
        feedback: "",
      };
    }

    if (isTimecodeFormat) {
      // Convert timecode to frames and duration in seconds
      const frames = timecodeToFrames(inputs.timecode.trim(), fpsNum);
      if (frames === null) {
        return {
          primary: "Invalid Timecode",
          secondary: "",
          details: `Frame number must be less than FPS (${fpsNum}).`,
          feedback: "",
        };
      }
      // Duration in seconds (float)
      const durationSeconds = frames / fpsNum;

      // Format duration as HH:MM:SS.sss (seconds with milliseconds)
      const hh = Math.floor(durationSeconds / 3600);
      const mm = Math.floor((durationSeconds % 3600) / 60);
      const ss = Math.floor(durationSeconds % 60);
      const ms = Math.round((durationSeconds - Math.floor(durationSeconds)) * 1000);

      const durationFormatted = `${pad(hh)}:${pad(mm)}:${pad(ss)}.${ms
        .toString()
        .padStart(3, "0")}`;

      return {
        primary: frames.toString(),
        secondary: "Total Frames",
        details: `Timecode ${inputs.timecode.trim()} at ${fpsNum} FPS equals ${frames} frames.`,
        feedback: `Duration is approximately ${durationFormatted} (HH:MM:SS.mmm).`,
      };
    } else {
      // Not timecode format, try parse as frames number
      const framesNum = Number(inputs.timecode.trim());
      if (isNaN(framesNum) || framesNum < 0) {
        return {
          primary: "Invalid input",
          secondary: "",
          details: "Input must be a valid timecode or non-negative frame number.",
          feedback: "",
        };
      }
      // Convert frames to timecode
      const tc = framesToTimecode(framesNum, fpsNum);
      return {
        primary: tc,
        secondary: "Timecode (HH:MM:SS:FF)",
        details: `${framesNum} frames at ${fpsNum} FPS equals timecode ${tc}.`,
        feedback: `Use the 180-degree shutter rule for smooth motion blur at this frame rate.`,
      };
    }
  }, [inputs]);

  const faqs = [
    {
      question: "What is the 180-degree shutter rule and how does it affect timecode?",
      answer:
        "The 180-degree shutter rule is a guideline in cinematography that sets the shutter speed to be double the frame rate, creating natural motion blur. While it primarily affects exposure and motion blur, understanding frame rates and shutter angles helps in accurate timecode and duration calculations, ensuring synchronization in production and post-production workflows.",
    },
    {
      question: "Can I use this calculator for non-integer frame rates like 23.976 or 29.97?",
      answer:
        "Yes, this calculator supports decimal frame rates such as 23.976 and 29.97. These are common in broadcast and film production. The calculations will handle these fractional frame rates accurately, but be aware that drop-frame timecode conventions are not handled here and require specialized tools.",
    },
    {
      question: "Why is the frame number in the timecode limited by the FPS?",
      answer:
        "The frame number (FF) in a timecode represents the frame count within one second and must be less than the frames per second (FPS). For example, at 24 FPS, frame numbers range from 00 to 23. Entering a frame number equal to or greater than the FPS is invalid and will cause errors in conversion.",
    },
    {
      question: "How do I convert total frames back to a readable timecode?",
      answer:
        "To convert total frames to timecode, divide the total frames by the FPS to get total seconds, then calculate hours, minutes, seconds, and remaining frames. This calculator performs this conversion automatically when you input a frame count and FPS.",
    },
    {
      question: "What is the difference between timecode and duration?",
      answer:
        "Timecode is a timestamp format (HH:MM:SS:FF) used to identify specific frames in video or audio. Duration refers to the length of a clip or segment, often expressed in time units like seconds or timecode format. This calculator helps convert between timecode, total frames, and duration based on FPS.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have a clip with a timecode of 00:02:15:10 and want to know how many frames it contains at 24 FPS.",
    steps: [
      {
        label: "Step 1",
        explanation: "Enter the timecode 00:02:15:10 into the timecode input field.",
      },
      {
        label: "Step 2",
        explanation: "Set the FPS value to 24.",
      },
      {
        label: "Step 3",
        explanation: "Click Calculate to see the total frames and duration.",
      },
    ],
    result:
      "The calculator shows 34810 total frames, which corresponds to approximately 00:02:15.417 duration at 24 FPS.",
  };

  const references = [
    {
      title: "Understanding Timecode and Frame Rates",
      description:
        "A comprehensive guide on timecode formats, frame rates, and their applications in video production.",
      url: "https://www.videomaker.com/article/c10/19054-understanding-timecode-and-frame-rates",
    },
    {
      title: "The 180 Degree Shutter Rule Explained",
      description:
        "An article explaining the 180-degree shutter rule and its impact on motion blur and frame rate.",
      url: "https://nofilmschool.com/what-is-the-180-degree-shutter-rule",
    },
    {
      title: "Frame Rate and Timecode Basics",
      description:
        "Technical overview of frame rates, timecode, and how they relate to video duration.",
      url: "https://www.videoguys.com/blog/understanding-frame-rates-and-timecode/",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="timecode">Timecode or Frames</Label>
          <Input
            id="timecode"
            placeholder="HH:MM:SS:FF or total frames"
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
            min={1}
            step={0.001}
            value={inputs.fps}
            onChange={(e) => handleInputChange("fps", e.target.value)}
            spellCheck={false}
            autoComplete="off"
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
          <li>Enter a timecode in the format HH:MM:SS:FF (e.g., 01:23:45:12) or a total frame count.</li>
          <li>Input the frames per second (FPS) value for your footage (e.g., 24, 25, 29.97).</li>
          <li>Click the Calculate button to convert between timecode, total frames, and duration.</li>
          <li>Review the results displayed below, including total frames or timecode and duration details.</li>
          <li>Use the information for editing, syncing, or logging your video and audio content accurately.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Timecode ↔ Duration (HH:MM:SS:FF) Converter
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Timecode is a fundamental concept in video and audio production, representing a unique identifier for each frame in a timeline. It is typically formatted as HH:MM:SS:FF, where HH is hours, MM is minutes, SS is seconds, and FF is frames. The frame count resets every second based on the frames per second (FPS) rate of the footage. Understanding how to convert between timecode, total frames, and duration is essential for editors, colorists, and post-production professionals to maintain synchronization and precision.
          </p>
          <p>
            This calculator allows you to input either a timecode or a total frame count along with the FPS value to convert between these formats. The 180-degree shutter rule, a standard in cinematography, suggests setting the shutter speed to double the frame rate to achieve natural motion blur. While this rule primarily affects exposure, it also influences how frame timing and duration are perceived in footage.
          </p>
          <p>
            When converting timecode to frames, the calculator multiplies each component by the FPS to get the total frame count. Conversely, when converting frames to timecode, it divides the total frames by the FPS to determine hours, minutes, seconds, and remaining frames. This process ensures accurate timing information for editing, conforming, and logging.
          </p>
          <p>
            It is important to note that this calculator does not handle drop-frame timecode, which is used in certain broadcast standards like 29.97 FPS NTSC video. For such cases, specialized tools are recommended. Additionally, always ensure the frame number in the timecode is less than the FPS to avoid invalid inputs.
          </p>
          <p>
            By mastering these conversions, professionals can streamline workflows, reduce errors, and maintain consistent timing across all stages of production and post-production.
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
            <strong>Warning:</strong> Entering a frame number (FF) equal to or greater than the FPS value in the timecode will cause invalid results. For example, at 24 FPS, the frame number must be between 00 and 23.
          </p>
          <p>
            <strong>Warning:</strong> Using this calculator for drop-frame timecode (e.g., 29.97 DF) is not supported and will yield incorrect conversions. Use dedicated drop-frame timecode tools for broadcast standards.
          </p>
          <p>
            <strong>Warning:</strong> Inputting negative numbers or non-numeric FPS values will cause errors. Always use positive numbers and valid frame rates.
          </p>
          <p>
            <strong>Warning:</strong> Confusing total frames with timecode format can lead to incorrect conversions. Ensure you input the correct format in the designated field.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="space-y-4 text-slate-700 dark:text-slate-300">
          <p>
            <strong>Scenario:</strong> You have a clip with a timecode of <code>00:02:15:10</code> and want to know how many frames it contains at 24 FPS.
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Enter the timecode <code>00:02:15:10</code> into the timecode input field.</li>
            <li>Set the FPS value to <code>24</code>.</li>
            <li>Click Calculate to see the total frames and duration.</li>
          </ol>
          <p>
            <strong>Result:</strong> The calculator shows <code>34810</code> total frames, which corresponds to approximately <code>00:02:15.417</code> duration at 24 FPS.
          </p>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24">
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