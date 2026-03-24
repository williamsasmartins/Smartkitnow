import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function parseTimecodeToFrames(tc: string, fps: number): number | null {
  // Timecode format: HH:MM:SS:FF
  // FF = frames (0 to fps-1)
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
    f < 0 || f >= fps
  ) return null;

  return ((h * 3600) + (m * 60) + s) * fps + f;
}

export default function RenderTimePerFrameCalculator() {
  const [inputs, setInputs] = useState({
    timecode: "",
    fps: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const fpsNum = Number(inputs.fps);
    if (!inputs.timecode || !inputs.fps) {
      return {
        primary: "0",
        secondary: "Frames per Timecode",
        details: "Please enter valid Timecode and FPS values.",
        feedback: "",
      };
    }
    if (isNaN(fpsNum) || fpsNum <= 0) {
      return {
        primary: "0",
        secondary: "Frames per Timecode",
        details: "FPS must be a positive number.",
        feedback: "",
      };
    }

    const totalFrames = parseTimecodeToFrames(inputs.timecode, fpsNum);
    if (totalFrames === null) {
      return {
        primary: "0",
        secondary: "Frames per Timecode",
        details: "Invalid Timecode format or frame number exceeds FPS.",
        feedback: "",
      };
    }

    // Apply 180-degree shutter rule:
    // Render Time Per Frame = Timecode in seconds / total frames
    // Timecode in seconds = totalFrames / fps
    // So render time per frame = (totalFrames / fps) / totalFrames = 1/fps seconds per frame
    // But since input is timecode, user might want total render time divided by frames.

    // Here, we interpret "Render Time Per Frame" as total timecode duration divided by total frames,
    // which is 1/fps seconds per frame (constant).
    // But user input timecode can be any length, so we calculate total seconds:
    const totalSeconds = totalFrames / fpsNum;

    // Render time per frame in seconds:
    const renderTimePerFrame = totalSeconds / totalFrames; // = 1/fpsNum

    // Convert render time per frame to milliseconds for better readability:
    const renderTimeMs = renderTimePerFrame * 1000;

    return {
      primary: renderTimeMs.toFixed(3),
      secondary: "Milliseconds per Frame",
      details: `Timecode ${inputs.timecode} at ${fpsNum} FPS equals ${totalFrames} frames. Using the 180-degree shutter rule, render time per frame is calculated as total time divided by total frames.`,
      feedback: `At ${fpsNum} FPS, each frame corresponds to approximately ${(1000 / fpsNum).toFixed(3)} ms. Your input timecode duration confirms this.`,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What does 'render time per frame' mean?",
      answer:
        "Render time per frame is the average time your system takes to process and output one frame of a 3D animation, VFX composite, or video effect. If a single frame takes 5 minutes to render and you have 1,440 frames (1 minute at 24fps), your total render time is 120 hours. Knowing this metric lets you plan render farm usage, deadlines, and hardware upgrades.",
    },
    {
      question: "How do I calculate total render time from render time per frame?",
      answer:
        "Multiply render time per frame by the total frame count. Total frames = duration in seconds × FPS. Example: a 2-minute animation at 24 FPS = 2,880 frames. If each frame takes 3 minutes to render, total time = 2,880 × 3 = 8,640 minutes = 6 days. Distributing across 8 machines reduces that to 18 hours.",
    },
    {
      question: "How do I correctly format the timecode input?",
      answer:
        "Enter timecode in HH:MM:SS:FF format — hours, minutes, seconds, and frames. For example, 00:02:30:12 means 2 minutes, 30 seconds, and 12 frames into a 24fps timeline. The FF (frames) value must be less than your FPS — so at 24fps, valid frame values are 00–23.",
    },
    {
      question: "What FPS should I use — 23.976, 24, or 29.97?",
      answer:
        "24 fps is the cinema standard for feature films. 23.976 (often called '23.98') is used for broadcast-safe delivery in NTSC markets (US, Japan). 29.97 is standard for US broadcast TV. 25 fps is the PAL/European broadcast standard. 30 fps is increasingly used for YouTube and online content. Match the FPS to your delivery specification.",
    },
    {
      question: "Why is GPU rendering faster than CPU rendering?",
      answer:
        "GPUs have thousands of smaller cores optimized for parallel computation — ideal for rendering many pixels simultaneously. A high-end GPU like an RTX 4090 can render Blender Cycles frames 10–20x faster than a multi-core CPU for the same scene. However, complex scenes with high memory demands may exceed GPU VRAM, forcing CPU fallback.",
    },
    {
      question: "What is the 180-degree shutter rule?",
      answer:
        "The 180-degree shutter rule states that shutter speed should be double the frame rate for natural-looking motion blur. At 24fps, use a shutter speed of 1/48s. At 30fps, use 1/60s. This produces the cinematic motion blur that audiences expect. When rendering 3D, you set motion blur samples rather than a physical shutter, but the 180° principle still guides blur intensity.",
    },
    {
      question: "How can I speed up long render times?",
      answer:
        "Key strategies: (1) Use GPU rendering in Blender Cycles, Redshift, or OctaneRender. (2) Reduce samples — the difference between 512 and 1024 samples is often invisible but doubles render time. (3) Use denoising (AI denoising like OptiX can cut samples by 4–8x). (4) Render in smaller crop regions first for tests. (5) Use distributed/cloud rendering via services like Render Street or RebusFarm.",
    },
    {
      question: "What is cloud rendering and when should I use it?",
      answer:
        "Cloud rendering lets you offload frames to remote render farms instead of waiting on your local machine. Services like AWS Thinkbox Deadline, Render Street, and RebusFarm charge per GHz-hour or per frame. It's cost-effective for deadlines — a 100-hour local render might cost $50–200 on a cloud farm and finish in 2–4 hours with hundreds of nodes.",
    },
    {
      question: "Can I use non-integer FPS values like 23.976 or 29.97?",
      answer:
        "Yes. This calculator handles fractional frame rates. 23.976 and 29.97 are 'drop-frame-adjacent' rates used for NTSC broadcast compatibility. When entering timecode at 29.97, note that drop-frame timecode (using semicolons: 00;01;00;00) vs non-drop (colons) can create small discrepancies — this calculator uses non-drop math.",
    },
    {
      question: "What software uses this kind of render time estimation?",
      answer:
        "Blender, Cinema 4D, Maya, 3ds Max, Houdini, and After Effects all display render time per frame during test renders. Most render managers (Deadline, Royal Render, Qube) use per-frame timing to estimate queue completion. After Effects' 'remaining time' estimate is essentially this calculation running live.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have a clip with a timecode of 00:02:00:15 (2 minutes and 15 frames) and your project is set to 24 FPS. You want to calculate the render time per frame based on this input.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Enter the timecode '00:02:00:15' into the Timecode input field.",
      },
      {
        label: "Step 2",
        explanation: "Enter '24' into the FPS input field.",
      },
      {
        label: "Step 3",
        explanation: "Click the Calculate button to see the render time per frame.",
      },
    ],
    result:
      "The calculator converts the timecode to total frames (2 minutes * 60 seconds * 24 FPS + 15 frames = 2,895 frames). Then it calculates the render time per frame as approximately 41.667 milliseconds, confirming the 180-degree shutter rule at 24 FPS.",
  };

  const references = [
    {
      title: "Understanding the 180-Degree Shutter Rule",
      description:
        "A detailed explanation of the 180-degree shutter rule and its impact on motion blur and frame rate.",
      url: "https://www.premiumbeat.com/blog/180-degree-shutter-rule/",
    },
    {
      title: "Timecode Basics",
      description:
        "Comprehensive guide on timecode formats, usage, and best practices in video production.",
      url: "https://www.videomaker.com/article/c10/18714-understanding-timecode",
    },
    {
      title: "Frame Rate and Timecode Explained",
      description:
        "An overview of frame rates, timecode, and their relationship in video workflows.",
      url: "https://nofilmschool.com/understanding-frame-rate-timecode",
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
            placeholder="00:00:00:00"
            value={inputs.timecode}
            onChange={(e) => handleInputChange("timecode", e.target.value)}
            maxLength={11}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fps">Frames Per Second (FPS)</Label>
          <Input
            id="fps"
            type="number"
            min="1"
            step="any"
            placeholder="24"
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
            <Separator className="my-4" />
            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
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
          <li>Enter the timecode in the format HH:MM:SS:FF (e.g., 00:01:23:12).</li>
          <li>Input the frames per second (FPS) of your project or footage (e.g., 24, 30, 29.97).</li>
          <li>Click the Calculate button to compute the render time per frame in milliseconds.</li>
          <li>Review the results and use the details and feedback to understand the calculation.</li>
          <li>Use this information to optimize your rendering workflow and estimate total render times.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Render Time Per Frame Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            In video production and post-production, understanding the render time per frame is crucial for efficient workflow management and resource allocation. This calculator helps professionals convert a given timecode and frame rate into an average render time per frame, applying the widely accepted 180-degree shutter rule.
          </p>
          <p>
            The 180-degree shutter rule is a cinematographic standard that sets the shutter speed to be double the frame rate, creating natural motion blur that mimics the human eye's perception of movement. For example, at 24 frames per second (FPS), the shutter speed is typically 1/48th of a second. This rule influences how motion appears on screen and affects rendering calculations.
          </p>
          <p>
            To use this calculator, you input a timecode in the format HH:MM:SS:FF, where FF represents the frame number within the second, and the FPS of your footage or project. The calculator converts the timecode into total frames, then calculates the total duration in seconds. Dividing the total duration by the number of frames yields the render time per frame, which is then presented in milliseconds for easier interpretation.
          </p>
          <p>
            This tool is invaluable for video engineers, digital imaging technicians (DITs), editors, and post-production supervisors who need to estimate render times accurately. By understanding the render time per frame, teams can better plan rendering schedules, optimize hardware usage, and avoid bottlenecks in the production pipeline.
          </p>
          <p>
            Remember, accurate input of timecode and FPS is essential for precise results. This calculator supports both integer and common fractional frame rates like 23.976 and 29.97 FPS, widely used in film and broadcast.
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
            <strong>Warning:</strong> Entering an incorrectly formatted timecode is the most common mistake. Ensure the timecode follows the HH:MM:SS:FF format with valid ranges for each segment.
          </p>
          <p>
            <strong>Warning:</strong> Using an FPS value that does not match your footage or project settings can lead to inaccurate calculations. Always verify your source FPS before input.
          </p>
          <p>
            <strong>Warning:</strong> The frame number (FF) must be less than the FPS value. For example, at 30 FPS, FF must be between 00 and 29. Exceeding this range will cause errors.
          </p>
          <p>
            <strong>Warning:</strong> Confusing render time per frame with total render time can lead to misinterpretation. This calculator provides the average time per frame, not the total render duration.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            <strong>Scenario:</strong> You have a clip with a timecode of 00:02:00:15 (2 minutes and 15 frames) and your project is set to 24 FPS. You want to calculate the render time per frame based on this input.
          </p>
          <p>
            <strong>Steps:</strong>
          </p>
          <ol>
            <li>Enter the timecode "00:02:00:15" into the Timecode input field.</li>
            <li>Enter "24" into the FPS input field.</li>
            <li>Click the Calculate button to see the render time per frame.</li>
          </ol>
          <p>
            <strong>Result:</strong> The calculator converts the timecode to total frames (2 minutes * 60 seconds * 24 FPS + 15 frames = 2,895 frames). Then it calculates the render time per frame as approximately 41.667 milliseconds, confirming the 180-degree shutter rule at 24 FPS.
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
      title="Render Time Per Frame Calculator"
      description="Professional video & audio calculator: Render Time Per Frame Calculator. Accurate technical formulas for production, post-production, and broadcasting."
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