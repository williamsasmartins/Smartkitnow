import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ShutterAngleSpeedHelper180DegreeRuleCalculator() {
  const [inputs, setInputs] = useState({
    shutterAngle: "", // degrees
    frameRate: "", // fps
    shutterSpeed: "", // seconds (optional, one of shutterAngle or shutterSpeed is input)
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  /**
   * Logic:
   * The 180° shutter rule states shutter speed = 1 / (2 * frame rate)
   * Shutter angle relates to shutter speed and frame rate by:
   * shutterSpeed = shutterAngle / 360 / frameRate
   * 
   * Given frameRate and shutterAngle, calculate shutterSpeed.
   * Given frameRate and shutterSpeed, calculate shutterAngle.
   * 
   * If both shutterAngle and shutterSpeed are given, verify if they comply with 180° rule.
   */

  const results = useMemo(() => {
    const shutterAngleNum = parseFloat(inputs.shutterAngle);
    const frameRateNum = parseFloat(inputs.frameRate);
    const shutterSpeedNum = parseFloat(inputs.shutterSpeed);

    if (!frameRateNum || frameRateNum <= 0) {
      return {
        primary: "-",
        secondary: "",
        details: "Please enter a valid frame rate (> 0).",
        feedback: "",
      };
    }

    // Standard shutter speed for 180° rule:
    const standardShutterSpeed = 1 / (2 * frameRateNum); // seconds
    const standardShutterAngle = 180; // degrees

    // If shutterAngle is provided and shutterSpeed is empty, calculate shutterSpeed
    if (shutterAngleNum && !shutterSpeedNum) {
      if (shutterAngleNum <= 0 || shutterAngleNum > 360) {
        return {
          primary: "-",
          secondary: "",
          details: "Shutter angle must be between 0 and 360 degrees.",
          feedback: "",
        };
      }
      const calcShutterSpeed = (shutterAngleNum / 360) / frameRateNum;
      const deviationPercent = ((calcShutterSpeed - standardShutterSpeed) / standardShutterSpeed) * 100;

      return {
        primary: calcShutterSpeed.toFixed(5),
        secondary: "seconds (shutter speed)",
        details: `Calculated shutter speed from shutter angle: ${shutterAngleNum}° at ${frameRateNum} fps.\nStandard 180° rule shutter speed is ${standardShutterSpeed.toFixed(5)} s.`,
        feedback:
          Math.abs(deviationPercent) < 1
            ? "This shutter speed closely follows the 180° rule, providing natural motion blur."
            : `This shutter speed deviates by ${deviationPercent.toFixed(1)}% from the 180° rule. Adjust for natural motion blur.`,
      };
    }

    // If shutterSpeed is provided and shutterAngle is empty, calculate shutterAngle
    if (shutterSpeedNum && !shutterAngleNum) {
      if (shutterSpeedNum <= 0 || shutterSpeedNum > 1) {
        return {
          primary: "-",
          secondary: "",
          details: "Shutter speed must be a positive fraction of a second (e.g., 0.0083 for 1/120).",
          feedback: "",
        };
      }
      const calcShutterAngle = shutterSpeedNum * frameRateNum * 360;
      const deviationPercent = ((calcShutterAngle - standardShutterAngle) / standardShutterAngle) * 100;

      return {
        primary: calcShutterAngle.toFixed(1),
        secondary: "degrees (shutter angle)",
        details: `Calculated shutter angle from shutter speed: ${shutterSpeedNum}s at ${frameRateNum} fps.\nStandard 180° rule shutter angle is 180°.`,
        feedback:
          Math.abs(deviationPercent) < 1
            ? "This shutter angle closely follows the 180° rule, providing natural motion blur."
            : `This shutter angle deviates by ${deviationPercent.toFixed(1)}% from the 180° rule. Adjust for natural motion blur.`,
      };
    }

    // If both shutterSpeed and shutterAngle are provided, verify compliance
    if (shutterSpeedNum && shutterAngleNum) {
      const calcShutterSpeedFromAngle = (shutterAngleNum / 360) / frameRateNum;
      const speedDiffPercent = ((shutterSpeedNum - calcShutterSpeedFromAngle) / calcShutterSpeedFromAngle) * 100;
      const deviationFrom180Speed = ((shutterSpeedNum - standardShutterSpeed) / standardShutterSpeed) * 100;
      const deviationFrom180Angle = ((shutterAngleNum - standardShutterAngle) / standardShutterAngle) * 100;

      return {
        primary: "Verification",
        secondary: "",
        details: `Provided shutter speed: ${shutterSpeedNum}s\nProvided shutter angle: ${shutterAngleNum}°\nCalculated shutter speed from angle: ${calcShutterSpeedFromAngle.toFixed(5)}s\nDeviation between provided speed and calculated speed: ${speedDiffPercent.toFixed(2)}%\nDeviation from 180° rule shutter speed: ${deviationFrom180Speed.toFixed(2)}%\nDeviation from 180° rule shutter angle: ${deviationFrom180Angle.toFixed(2)}%`,
        feedback:
          Math.abs(deviationFrom180Speed) < 1 && Math.abs(deviationFrom180Angle) < 1
            ? "Both shutter speed and angle closely follow the 180° rule."
            : "Provided values deviate from the 180° rule. Adjust shutter speed or angle for natural motion blur.",
      };
    }

    // If only frameRate is provided, show standard shutter speed for 180° rule
    if (!shutterAngleNum && !shutterSpeedNum) {
      return {
        primary: standardShutterSpeed.toFixed(5),
        secondary: "seconds (standard shutter speed)",
        details: `Standard shutter speed for 180° rule at ${frameRateNum} fps is 1/(2*frameRate) = ${standardShutterSpeed.toFixed(5)} seconds.`,
        feedback: "Use this shutter speed to achieve natural motion blur according to the 180° rule.",
      };
    }

    return {
      primary: "-",
      secondary: "",
      details: "Please enter either shutter angle or shutter speed along with frame rate.",
      feedback: "",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the 180° shutter rule and why is it important?",
      answer:
        "The 180° shutter rule is a guideline in cinematography that suggests setting the shutter speed to be double the frame rate (shutter speed = 1/(2*frame rate)). This creates natural motion blur that mimics how the human eye perceives movement, resulting in smooth and cinematic footage. Deviating from this rule can cause unnatural motion artifacts or strobing effects.",
    },
    {
      question: "How do shutter angle and shutter speed relate to each other?",
      answer:
        "Shutter angle and shutter speed are two ways to describe the exposure time per frame in a camera. Shutter angle is a mechanical term from film cameras representing the angle of the rotating shutter, while shutter speed is the actual exposure duration in seconds. They relate by the formula: shutter speed = (shutter angle / 360) / frame rate.",
    },
    {
      question: "Can I use shutter speeds faster or slower than the 180° rule?",
      answer:
        "Yes, you can adjust shutter speed faster or slower than the 180° rule for creative effects. Faster shutter speeds reduce motion blur, creating a staccato or crisp look, often used in action scenes. Slower shutter speeds increase motion blur, which can create dreamy or surreal effects. However, straying too far from the 180° rule may look unnatural to viewers.",
    },
    {
      question: "Why is frame rate critical when calculating shutter speed or angle?",
      answer:
        "Frame rate determines how many frames are captured per second, directly affecting the exposure time per frame. Since shutter speed and shutter angle define exposure duration relative to frame rate, accurate frame rate input is essential to calculate correct shutter settings. Incorrect frame rate leads to improper exposure and motion blur.",
    },
    {
      question: "How does shutter angle affect motion blur in video?",
      answer:
        "Shutter angle controls the duration the camera sensor is exposed to light per frame. A larger shutter angle (closer to 360°) means longer exposure and more motion blur, while a smaller angle means shorter exposure and less blur. The 180° shutter angle is standard for natural-looking motion blur, balancing clarity and smoothness.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Shooting a cinematic scene at 24 fps and wanting to find the correct shutter speed to follow the 180° shutter rule for natural motion blur.",
    steps: [
      {
        label: "Step 1",
        explanation: "Identify the frame rate: 24 frames per second (fps).",
      },
      {
        label: "Step 2",
        explanation:
          "Apply the 180° shutter rule formula: shutter speed = 1 / (2 × frame rate) = 1 / (2 × 24) = 1/48 seconds ≈ 0.02083 seconds.",
      },
      {
        label: "Step 3",
        explanation:
          "If using shutter angle instead, shutter angle = shutter speed × frame rate × 360 = 0.02083 × 24 × 360 = 180°.",
      },
    ],
    result:
      "The correct shutter speed to use at 24 fps is approximately 1/48 seconds, which corresponds to a 180° shutter angle, ensuring natural motion blur.",
  };

  const references = [
    {
      title: "SMPTE Standards",
      description: "Official standards for timecode and frame rates in video production.",
      url: "https://www.smpte.org/",
    },
    {
      title: "American Cinematographer Manual",
      description:
        "Comprehensive guide covering shutter angles, speeds, and cinematography techniques.",
      url: "https://ascmag.com/",
    },
    {
      title: "Film and Digital Times - Shutter Angle Explained",
      description:
        "An article explaining shutter angle and its impact on motion blur and exposure.",
      url: "https://www.fdtimes.com/shutter-angle-explained/",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="frameRate">Frame Rate (fps)</Label>
          <Input
            id="frameRate"
            type="number"
            min="1"
            step="any"
            placeholder="e.g. 24"
            value={inputs.frameRate}
            onChange={(e) => handleInputChange("frameRate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="shutterAngle">Shutter Angle (°)</Label>
          <Input
            id="shutterAngle"
            type="number"
            min="0"
            max="360"
            step="any"
            placeholder="e.g. 180"
            value={inputs.shutterAngle}
            onChange={(e) => handleInputChange("shutterAngle", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="shutterSpeed">Shutter Speed (seconds)</Label>
          <Input
            id="shutterSpeed"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 0.0083 (1/120)"
            value={inputs.shutterSpeed}
            onChange={(e) => handleInputChange("shutterSpeed", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Film className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center whitespace-pre-line">
            <span className="text-sm font-semibold text-slate-500 uppercase">Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            {results.feedback && (
              <>
                <Separator className="my-4" />
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">{results.feedback}</p>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use this calculator</h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>Enter the frame rate of your video footage in frames per second (fps). This is mandatory.</li>
          <li>Input either the shutter angle in degrees (0–360°) or the shutter speed in seconds (e.g., 0.0083 for 1/120s). Leave the other field empty.</li>
          <li>Click the Calculate button to compute the missing value based on the 180° shutter rule.</li>
          <li>If you input both shutter angle and shutter speed, the calculator will verify their consistency and adherence to the 180° rule.</li>
          <li>Review the results and feedback to adjust your camera settings for optimal motion blur and cinematic quality.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Shutter Angle/Speed Helper (180° Rule)
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            The 180° shutter rule is a fundamental principle in cinematography that helps filmmakers achieve natural and pleasing motion blur in their footage. It originates from the mechanical shutter angle of film cameras, where a 180° shutter angle means the shutter is open for half the duration of each frame. This translates to a shutter speed that is exactly half the frame interval, or mathematically, shutter speed = 1 / (2 × frame rate).
          </p>
          <p>
            For example, if you are shooting at 24 frames per second (fps), the ideal shutter speed according to the 180° rule is 1/48 seconds. This setting ensures that motion appears smooth and natural to the human eye, avoiding strobing or unnatural sharpness that can occur with faster shutter speeds or excessive blur with slower speeds.
          </p>
          <p>
            Shutter angle and shutter speed are two ways to describe the exposure time per frame. Shutter angle is a legacy term from film cameras, describing the physical angle of the rotating shutter, while shutter speed is the actual exposure duration in seconds. They are related by the formula: shutter speed = (shutter angle / 360) / frame rate. This calculator allows you to input either shutter angle or shutter speed along with frame rate to find the missing value or verify compliance with the 180° rule.
          </p>
          <p>
            Understanding and applying the 180° shutter rule is essential for achieving cinematic motion blur that feels natural and immersive. Deviations from this rule can be used creatively but should be done with awareness of the visual impact. This tool is designed to assist professionals and enthusiasts in setting their camera shutter parameters accurately for optimal results in production and post-production workflows.
          </p>
        </div>
      </section>

      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
          <p>
            <strong>Warning:</strong> One critical mistake is entering inconsistent or invalid values for shutter angle and shutter speed simultaneously without verifying their relationship. This can lead to incorrect exposure times and unnatural motion blur. Always ensure only one of these values is input unless you want to verify their consistency.
          </p>
          <p>
            Another common error is neglecting the frame rate or entering an incorrect frame rate, which skews all calculations. Frame rate must be accurate and greater than zero to produce meaningful shutter speed or angle results.
          </p>
          <p>
            Avoid using shutter angles outside the 0–360° range or shutter speeds that are unrealistically long or short for your frame rate, as these can cause exposure and motion artifacts.
          </p>
          <p>
            Lastly, misunderstanding the difference between shutter speed and shutter angle can cause confusion. Remember, shutter angle is a mechanical concept, while shutter speed is a time measurement; they are related but not interchangeable without calculation.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
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