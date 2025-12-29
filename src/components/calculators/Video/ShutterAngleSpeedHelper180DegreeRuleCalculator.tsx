import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function parseTimecodeToFrames(tc: string, fps: number): number | null {
  // Expected format: HH:MM:SS:FF
  const parts = tc.split(":");
  if (parts.length !== 4) return null;
  const [hh, mm, ss, ff] = parts.map((p) => parseInt(p, 10));
  if (
    [hh, mm, ss, ff].some(
      (v) => isNaN(v) || v < 0 || (v === ff && v >= fps) || mm >= 60 || ss >= 60
    )
  )
    return null;
  return ((hh * 3600 + mm * 60 + ss) * fps + ff);
}

function framesToTimecode(frames: number, fps: number): string {
  const hh = Math.floor(frames / (3600 * fps));
  frames -= hh * 3600 * fps;
  const mm = Math.floor(frames / (60 * fps));
  frames -= mm * 60 * fps;
  const ss = Math.floor(frames / fps);
  const ff = frames - ss * fps;
  return [hh, mm, ss, ff]
    .map((v) => v.toString().padStart(2, "0"))
    .join(":");
}

export default function ShutterAngleSpeedHelper180DegreeRuleCalculator() {
  const [inputs, setInputs] = useState({
    timecode: "",
    fps: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const fpsNum = parseFloat(inputs.fps);
    if (!inputs.timecode || isNaN(fpsNum) || fpsNum <= 0) {
      return {
        primary: "-",
        secondary: "",
        details: "Please enter a valid Timecode and FPS.",
        feedback: "",
      };
    }
    const totalFrames = parseTimecodeToFrames(inputs.timecode, fpsNum);
    if (totalFrames === null) {
      return {
        primary: "-",
        secondary: "",
        details:
          "Invalid timecode format or frame number exceeds FPS. Use HH:MM:SS:FF format.",
        feedback: "",
      };
    }

    // 180° rule: shutter speed = 1 / (2 * fps)
    // shutter angle = shutter speed * fps * 360°
    // shutter speed in seconds = 1 / (fps * 2)
    // shutter angle = 180° (fixed by rule)
    // We can calculate shutter speed (seconds) and shutter angle (degrees)
    // Also, calculate frame duration in seconds = 1 / fps
    // Calculate shutter speed in frames = shutter speed * fps = 0.5 frames

    const shutterSpeedSeconds = 1 / (fpsNum * 2); // 180° rule shutter speed
    const shutterAngle = 180; // fixed by rule

    // Calculate shutter speed in frames (fractional)
    const shutterSpeedFrames = shutterSpeedSeconds * fpsNum;

    // Calculate timecode duration in seconds
    const durationSeconds = totalFrames / fpsNum;

    // Calculate number of shutter intervals in the duration
    const shutterIntervals = durationSeconds / shutterSpeedSeconds;

    return {
      primary: shutterSpeedSeconds.toFixed(4) + " s",
      secondary: `Shutter Speed (180° rule) at ${fpsNum} FPS`,
      details: `Timecode ${inputs.timecode} equals ${totalFrames} frames at ${fpsNum} FPS.
Shutter angle is fixed at ${shutterAngle}°. Shutter speed is 1/(2×FPS) = ${shutterSpeedSeconds.toFixed(
        4
      )} seconds (~${shutterSpeedFrames.toFixed(2)} frames).`,
      feedback:
        "Use this shutter speed to achieve natural motion blur consistent with the 180° shutter angle rule.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the 180° shutter angle rule?",
      answer:
        "The 180° shutter angle rule is a standard in cinematography that sets the shutter speed to be half the frame rate. This means if you shoot at 24 FPS, your shutter speed should be 1/48 second. This rule helps create natural motion blur that mimics the human eye's perception, resulting in smooth and cinematic footage.",
    },
    {
      question: "How do I convert timecode to frames?",
      answer:
        "To convert timecode (HH:MM:SS:FF) to frames, multiply hours by 3600, minutes by 60, add seconds, then multiply by the frame rate, and finally add the frame count. For example, at 30 FPS, 00:01:00:15 equals (0*3600 + 1*60 + 0)*30 + 15 = 1815 frames.",
    },
    {
      question: "Can I use this calculator for any frame rate?",
      answer:
        "Yes, this calculator supports any positive frame rate you input. It calculates the shutter speed based on the 180° rule for your specified FPS, ensuring correct shutter speed for smooth motion blur regardless of frame rate.",
    },
    {
      question: "Why is shutter speed important in video?",
      answer:
        "Shutter speed controls how long the camera sensor is exposed to light for each frame. It affects motion blur and exposure. Using the correct shutter speed, such as the 180° rule, ensures natural-looking motion blur and prevents choppy or overly sharp footage.",
    },
    {
      question: "What happens if I don't follow the 180° shutter angle rule?",
      answer:
        "Not following the 180° rule can result in unnatural motion blur. A faster shutter speed (smaller angle) produces choppy, staccato motion, while a slower shutter speed (larger angle) causes excessive blur and ghosting. The 180° rule balances clarity and smoothness for cinematic quality.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You are shooting a scene at 24 FPS and want to set your shutter speed according to the 180° rule for natural motion blur.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Enter the timecode of your clip, for example, 00:00:10:00 (10 seconds at 24 FPS).",
      },
      {
        label: "Step 2",
        explanation: "Input the frame rate as 24 FPS.",
      },
      {
        label: "Step 3",
        explanation:
          "Calculate the shutter speed: 1 / (2 × 24) = 1/48 seconds (~0.0208 s).",
      },
      {
        label: "Step 4",
        explanation:
          "Use this shutter speed on your camera to achieve the correct motion blur for cinematic footage.",
      },
    ],
    result:
      "The calculator shows a shutter speed of 0.0208 seconds (1/48 s) for 24 FPS, following the 180° shutter angle rule.",
  };

  const references = [
    {
      title: "American Cinematographer Manual",
      description:
        "A comprehensive guide covering cinematography techniques including shutter angle and shutter speed.",
      url: "https://ascmag.com/",
    },
    {
      title: "The 180 Degree Shutter Rule Explained",
      description:
        "An article explaining the importance of the 180° shutter angle rule in filmmaking.",
      url: "https://www.premiumbeat.com/blog/180-degree-shutter-rule/",
    },
    {
      title: "Timecode and Frame Rate Basics",
      description:
        "Detailed explanation of timecode formats and frame rate conversions.",
      url: "https://www.videomaker.com/article/c10/18753-understanding-timecode",
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

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Film className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs whitespace-pre-line text-slate-500 mt-2">{results.details}</p>
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
          <li>Enter the timecode of your video clip in the format HH:MM:SS:FF.</li>
          <li>Input the frame rate (FPS) at which the video was recorded or will be played back.</li>
          <li>Click the Calculate button to compute the shutter speed based on the 180° shutter angle rule.</li>
          <li>Review the result showing the shutter speed in seconds and additional details.</li>
          <li>Use the calculated shutter speed to set your camera or adjust your footage for natural motion blur.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Shutter Angle/Speed Helper (180° Rule)
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            The 180° shutter angle rule is a fundamental principle in cinematography that helps
            filmmakers achieve natural and pleasing motion blur in their footage. It states that the
            shutter speed should be set to exactly half the frame rate. For example, if you are
            shooting at 24 frames per second (FPS), your shutter speed should be 1/48 of a second.
            This rule mimics the motion blur characteristics of traditional film cameras and the
            human eye's perception of motion, resulting in footage that looks smooth and cinematic.
          </p>
          <p>
            Understanding how to convert timecode to frames is essential when working with video
            editing and post-production. Timecode is a way to label each frame of video with a
            unique identifier in the format HH:MM:SS:FF, where FF represents the frame number within
            the second. By converting timecode to total frames, you can precisely calculate durations,
            synchronize audio, and apply effects accurately.
          </p>
          <p>
            This calculator allows you to input a timecode and frame rate to determine the ideal shutter
            speed based on the 180° rule. It also provides details about the shutter angle and how it
            relates to shutter speed and frame rate. Using this tool ensures that your footage maintains
            the correct motion blur, avoiding the unnatural staccato or overly blurred effects caused
            by incorrect shutter settings.
          </p>
          <p>
            Whether you are shooting narrative films, commercials, or documentaries, adhering to the
            180° shutter angle rule is a best practice that enhances the visual quality of your work.
            This calculator is a handy reference for camera operators, DITs, editors, and colorists
            to maintain consistency and professionalism throughout the production pipeline.
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
            <strong>Warning:</strong> One common mistake is entering an invalid timecode format or
            frame number exceeding the FPS, which leads to incorrect calculations. Always use the
            HH:MM:SS:FF format and ensure the frame count (FF) is less than the FPS value.
          </p>
          <p>
            Another frequent error is neglecting to match the shutter speed to the frame rate,
            resulting in unnatural motion blur. Avoid setting shutter speeds that are too fast or
            too slow relative to your FPS.
          </p>
          <p>
            Lastly, some users confuse shutter angle with shutter speed. Remember, the 180° shutter
            angle corresponds to a shutter speed of 1/(2×FPS), not simply 1/FPS.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            <strong>Scenario:</strong> You are shooting a scene at 24 FPS and want to set your shutter
            speed according to the 180° rule for natural motion blur.
          </p>
          <ol>
            <li>Enter the timecode of your clip, for example, 00:00:10:00 (10 seconds at 24 FPS).</li>
            <li>Input the frame rate as 24 FPS.</li>
            <li>
              Calculate the shutter speed: 1 / (2 × 24) = 1/48 seconds (~0.0208 s).
            </li>
            <li>
              Use this shutter speed on your camera to achieve the correct motion blur for cinematic
              footage.
            </li>
          </ol>
          <p>
            <strong>Result:</strong> The calculator shows a shutter speed of 0.0208 seconds (1/48 s) for
            24 FPS, following the 180° shutter angle rule.
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
      title="Shutter Angle/Speed Helper (180° Rule)"
      description="Professional video & audio calculator: Shutter Angle/Speed Helper (180° Rule). Accurate technical formulas for production, post-production, and broadcasting."
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