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

export default function VideoExportTimeEstimatorCalculator() {
  const [inputs, setInputs] = useState({
    frameCount: "",
    secPerFrame: "",
    nodes: "1",
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only positive numbers or empty string
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  const results = useMemo(() => {
    const frameCountNum = parseFloat(inputs.frameCount);
    const secPerFrameNum = parseFloat(inputs.secPerFrame);
    const nodesNum = parseInt(inputs.nodes);

    if (
      isNaN(frameCountNum) ||
      frameCountNum <= 0 ||
      isNaN(secPerFrameNum) ||
      secPerFrameNum <= 0 ||
      isNaN(nodesNum) ||
      nodesNum <= 0
    ) {
      return {
        primary: "0",
        secondary: "Hours / Minutes",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "",
      };
    }

    // Total time in seconds = (Frame Count) * (Seconds per Frame) / (Nodes)
    const totalSeconds = (frameCountNum * secPerFrameNum) / nodesNum;

    // Convert totalSeconds to hours, minutes, seconds
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.round(totalSeconds % 60);

    // Format result string
    const timeParts = [];
    if (hours > 0) timeParts.push(`${hours}h`);
    if (minutes > 0) timeParts.push(`${minutes}m`);
    if (seconds > 0 || timeParts.length === 0) timeParts.push(`${seconds}s`);

    const formattedTime = timeParts.join(" ");

    return {
      primary: formattedTime,
      secondary: "Estimated Export Time",
      details: `Calculation: (${frameCountNum} frames) × (${secPerFrameNum} sec/frame) ÷ (${nodesNum} nodes) = ${totalSeconds.toFixed(
        2
      )} seconds`,
      feedback:
        nodesNum > 1
          ? "Using multiple nodes reduces export time proportionally."
          : "Consider using multiple nodes to speed up export time.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What does 'Seconds per Frame' mean?",
      answer:
        "Seconds per Frame refers to the average time it takes to render or export a single frame of your video. This value depends on your hardware, software, and the complexity of your project. Accurately estimating this helps predict total export time.",
    },
    {
      question: "How do multiple nodes affect export time?",
      answer:
        "Multiple nodes allow parallel processing of frames, effectively dividing the workload. If you have 4 nodes, the total export time ideally reduces to one-fourth, assuming perfect load balancing and no overhead.",
    },
    {
      question: "Can this calculator handle variable frame rates?",
      answer:
        "This calculator assumes a constant frame rate and uniform seconds per frame. For variable frame rates or complex projects, consider using an average seconds per frame or segmenting your calculation accordingly.",
    },
    {
      question: "Why is frame count important?",
      answer:
        "Frame count is the total number of frames in your video sequence. Since export time scales linearly with the number of frames, knowing this number is essential for an accurate estimate.",
    },
    {
      question: "What if my export time differs from the estimate?",
      answer:
        "Estimates are based on average values and ideal conditions. Real-world factors like hardware throttling, background processes, or software inefficiencies can cause deviations. Use this as a guideline, not an exact prediction.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have a 10,000 frame video project. Each frame takes approximately 0.5 seconds to export. You have access to 2 rendering nodes.",
    steps: [
      {
        label: "Step 1",
        explanation: "Enter 10,000 as the Frame Count.",
      },
      {
        label: "Step 2",
        explanation: "Enter 0.5 as Seconds per Frame.",
      },
      {
        label: "Step 3",
        explanation: "Enter 2 as the number of Nodes.",
      },
      {
        label: "Step 4",
        explanation:
          "Click Calculate to see the estimated total export time.",
      },
    ],
    result:
      "The calculator estimates 41 minutes and 40 seconds total export time, showing how parallel nodes reduce the time from 5000 seconds to 2500 seconds.",
  };

  const references = [
    {
      title: "Understanding Render Times in Video Production",
      description:
        "A comprehensive article explaining factors affecting video export times and optimization techniques.",
      url: "https://www.premiumbeat.com/blog/understanding-render-times-video-production/",
    },
    {
      title: "Parallel Rendering and Distributed Computing",
      description:
        "An overview of how multiple nodes and distributed systems speed up rendering tasks.",
      url: "https://www.fxguide.com/fxfeatured/parallel-rendering-and-distributed-computing/",
    },
    {
      title: "Video Export Optimization Tips",
      description:
        "Tips and best practices to optimize your video export workflow for faster results.",
      url: "https://helpx.adobe.com/premiere-pro/using/exporting-media.html",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="frameCount">Frame Count</Label>
          <Input
            id="frameCount"
            type="number"
            min="1"
            step="1"
            placeholder="e.g. 10000"
            value={inputs.frameCount}
            onChange={(e) => handleInputChange("frameCount", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="secPerFrame">Seconds per Frame</Label>
          <Input
            id="secPerFrame"
            type="number"
            min="0.001"
            step="0.001"
            placeholder="e.g. 0.5"
            value={inputs.secPerFrame}
            onChange={(e) => handleInputChange("secPerFrame", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nodes">Number of Nodes</Label>
          <Input
            id="nodes"
            type="number"
            min="1"
            step="1"
            placeholder="e.g. 1"
            value={inputs.nodes}
            onChange={(e) => handleInputChange("nodes", e.target.value)}
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
            {results.feedback && (
              <>
                <Separator className="my-4" />
                <p className="text-sm text-blue-700 dark:text-blue-400 font-semibold">{results.feedback}</p>
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
          <li>Enter the total number of frames in your video project in the "Frame Count" field.</li>
          <li>
            Input the average time it takes to export or render one frame in seconds into the "Seconds per Frame" field.
          </li>
          <li>Specify the number of rendering nodes or machines you will use to process the export.</li>
          <li>Click the "Calculate" button to see the estimated total export time displayed below.</li>
          <li>
            Use the result to plan your rendering schedule and optimize resources effectively.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Video Export Time Estimator
        </h2>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            Estimating video export time is crucial for professionals working in video production, post-production, and broadcasting. The total export time depends primarily on three factors: the total number of frames in the video, the average time it takes to render each frame, and the number of rendering nodes available to process the export in parallel.
          </p>
          <p>
            The frame count is simply the total number of frames in your video timeline. For example, a 10-minute video at 30 frames per second contains 18,000 frames (10 × 60 × 30). Knowing this number helps you understand the scale of your export task.
          </p>
          <p>
            Seconds per frame is a measure of how long your system takes to render or export a single frame. This depends on many factors including the complexity of effects, resolution, codec, and hardware performance. You can estimate this by timing a small segment of your project or using historical data from previous exports.
          </p>
          <p>
            Nodes refer to the number of machines or processors working simultaneously on the export. Using multiple nodes can significantly reduce total export time by dividing the workload. However, keep in mind that real-world efficiency may be affected by overhead, network speed, and load balancing.
          </p>
          <p>
            This calculator uses a simple formula: total export time = (frame count × seconds per frame) ÷ nodes. The result is presented in a human-readable format (hours, minutes, seconds) to help you plan your workflow efficiently.
          </p>
          <p>
            By accurately estimating export times, you can better schedule your projects, allocate resources, and avoid unexpected delays in your production pipeline.
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
            <strong>Warning:</strong> Entering inaccurate seconds per frame can lead to misleading estimates. Always measure or use realistic averages based on your actual export conditions.
          </p>
          <p>
            <strong>Warning:</strong> Forgetting to adjust the number of nodes when using distributed rendering will cause underestimation of export time.
          </p>
          <p>
            <strong>Warning:</strong> Assuming perfect linear scaling with nodes ignores overhead and network latency, so actual speedup may be less.
          </p>
          <p>
            <strong>Warning:</strong> Not considering variable frame rates or complex effects that may cause some frames to take longer than others can reduce accuracy.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="space-y-4 text-slate-700 dark:text-slate-300">
          <p>
            <strong>Scenario:</strong> You have a 10,000 frame video project. Each frame takes approximately 0.5 seconds to export. You have access to 2 rendering nodes.
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Enter 10,000 as the Frame Count.</li>
            <li>Enter 0.5 as Seconds per Frame.</li>
            <li>Enter 2 as the number of Nodes.</li>
            <li>Click Calculate to see the estimated total export time.</li>
          </ol>
          <p>
            <strong>Result:</strong> The calculator estimates 41 minutes and 40 seconds total export time, showing how parallel nodes reduce the time from 5000 seconds to 2500 seconds.
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
      title="Video Export Time Estimator"
      description="Professional video & audio calculator: Video Export Time Estimator. Accurate technical formulas for production, post-production, and broadcasting."
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