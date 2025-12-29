import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function GpuRenderPerformanceCalculator() {
  const [inputs, setInputs] = useState({
    frameCount: "",
    secPerFrame: "",
    nodes: "",
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  const results = useMemo(() => {
    const frameCount = parseInt(inputs.frameCount, 10);
    const secPerFrame = parseFloat(inputs.secPerFrame);
    const nodes = parseInt(inputs.nodes, 10);

    if (
      isNaN(frameCount) ||
      frameCount <= 0 ||
      isNaN(secPerFrame) ||
      secPerFrame <= 0 ||
      isNaN(nodes) ||
      nodes <= 0
    ) {
      return {
        primary: "0",
        secondary: "Hours / Mins",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "",
      };
    }

    // Total time in seconds = (frameCount * secPerFrame) / nodes
    const totalSeconds = (frameCount * secPerFrame) / nodes;

    // Convert totalSeconds to hours and minutes
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const timeString =
      (hours > 0 ? `${hours}h ` : "") +
      (minutes > 0 ? `${minutes}m ` : "") +
      (seconds > 0 ? `${seconds}s` : "");

    return {
      primary: timeString || "0s",
      secondary: "Total Render Time",
      details: `Rendering ${frameCount} frames at ${secPerFrame.toFixed(
        2
      )} sec/frame using ${nodes} node${nodes > 1 ? "s" : ""}.`,
      feedback:
        "Increasing the number of nodes reduces total render time, but consider overhead and resource allocation for optimal performance.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What does 'nodes' mean in GPU rendering?",
      answer:
        "In GPU rendering, 'nodes' refer to the number of individual machines or GPUs working in parallel to process the render. More nodes typically mean faster rendering times as the workload is distributed, but network and coordination overhead can affect efficiency.",
    },
    {
      question: "Why is sec/frame important for render time calculation?",
      answer:
        "Seconds per frame (sec/frame) indicates how long it takes to render a single frame on a single node. This metric is crucial because total render time depends on how long each frame takes multiplied by the total number of frames, adjusted by the number of nodes.",
    },
    {
      question: "Can I use this calculator for CPU rendering?",
      answer:
        "Yes, the calculator can be used for CPU rendering as well, as long as you input the correct seconds per frame and number of nodes (CPUs or machines). The formula remains the same, but performance characteristics may differ.",
    },
    {
      question: "Does adding more nodes always reduce render time linearly?",
      answer:
        "Not always. While adding nodes generally decreases render time, factors like network latency, data transfer overhead, and scene complexity can cause diminishing returns. It's important to balance resources for optimal efficiency.",
    },
    {
      question: "How accurate is this calculator?",
      answer:
        "This calculator provides an estimate based on input values. Actual render times can vary due to hardware differences, software optimizations, scene complexity, and other factors. Use it as a planning tool rather than an exact predictor.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "A VFX studio needs to estimate total render time for a 240-frame animation sequence using a GPU render farm with 8 nodes.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Determine the total number of frames: 240 frames.",
      },
      {
        label: "Step 2",
        explanation:
          "Measure or estimate the seconds per frame on a single node: 45 seconds/frame.",
      },
      {
        label: "Step 3",
        explanation:
          "Input the number of nodes available: 8 nodes.",
      },
      {
        label: "Step 4",
        explanation:
          "Calculate total render time: (240 frames * 45 sec/frame) / 8 nodes = 1350 seconds (22m 30s).",
      },
    ],
    result:
      "The total estimated render time is approximately 22 minutes and 30 seconds, allowing the studio to plan their schedule accordingly.",
  };

  const references = [
    {
      title: "GPU Rendering Basics - NVIDIA Developer",
      description:
        "Comprehensive guide on GPU rendering principles and performance optimization.",
      url: "https://developer.nvidia.com/gpu-rendering-basics",
    },
    {
      title: "Render Farm Management - Chaos Group",
      description:
        "Insights into managing render farms and optimizing distributed rendering workflows.",
      url: "https://www.chaos.com/vray/render-farm-management",
    },
    {
      title: "Understanding Render Times - Blender Manual",
      description:
        "Detailed explanation of factors affecting render times in Blender and how to estimate them.",
      url: "https://docs.blender.org/manual/en/latest/render/performance.html",
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
            min={1}
            step={1}
            placeholder="e.g. 240"
            value={inputs.frameCount}
            onChange={(e) => handleInputChange("frameCount", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="secPerFrame">Seconds per Frame</Label>
          <Input
            id="secPerFrame"
            type="number"
            min={0.01}
            step={0.01}
            placeholder="e.g. 45.5"
            value={inputs.secPerFrame}
            onChange={(e) => handleInputChange("secPerFrame", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nodes">Number of Nodes</Label>
          <Input
            id="nodes"
            type="number"
            min={1}
            step={1}
            placeholder="e.g. 8"
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
                <p className="text-sm text-slate-700 dark:text-slate-300 italic">{results.feedback}</p>
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
          <li>Enter the total number of frames you need to render in the "Frame Count" field.</li>
          <li>Input the average time it takes to render a single frame on one node in seconds into the "Seconds per Frame" field.</li>
          <li>Specify the number of rendering nodes (GPUs or machines) you will use to distribute the workload.</li>
          <li>Click the "Calculate" button to see the estimated total render time displayed below.</li>
          <li>Use the result to plan your rendering schedule and optimize resource allocation.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to GPU Render Performance Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Rendering performance is a critical factor in video production, VFX, and animation workflows. The GPU Render Performance Calculator helps professionals estimate the total time required to render a sequence of frames using GPU resources distributed across multiple nodes.
          </p>
          <p>
            The calculation is straightforward: multiply the total number of frames by the average seconds it takes to render each frame on a single node, then divide by the number of nodes working in parallel. This formula assumes an ideal linear scaling of performance, which is a good starting point for planning.
          </p>
          <p>
            However, real-world factors such as network overhead, data transfer times, and scene complexity can affect actual render times. It's important to measure seconds per frame accurately on your hardware and consider potential bottlenecks when scaling up nodes.
          </p>
          <p>
            This calculator is useful for studios and freelancers alike to estimate deadlines, optimize render farm usage, and budget time effectively. By understanding how each input affects total render time, users can make informed decisions about hardware investments and workflow adjustments.
          </p>
          <p>
            Remember, while adding more nodes generally decreases render time, it may not always result in perfectly linear improvements due to overhead and diminishing returns. Use this tool as a guide and complement it with real-world testing for best results.
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
            <strong>Warning:</strong> Entering zero or negative values for any input will invalidate the calculation. Always use positive numbers.
          </p>
          <p>
            <strong>Warning:</strong> Assuming perfect linear scaling with nodes can lead to underestimating render times. Network and coordination overhead often reduce efficiency.
          </p>
          <p>
            <strong>Warning:</strong> Using inaccurate seconds per frame values from different hardware or scenes can skew results. Measure or estimate carefully.
          </p>
          <p>
            <strong>Warning:</strong> Forgetting to account for frame count correctly (e.g., off-by-one errors) can cause miscalculations.
          </p>
          <p>
            <strong>Warning:</strong> Not considering that some rendering tasks may not parallelize well, leading to bottlenecks despite many nodes.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="space-y-4">
          <p><strong>Scenario:</strong> A VFX studio needs to estimate total render time for a 240-frame animation sequence using a GPU render farm with 8 nodes.</p>
          <ol className="list-decimal pl-5 space-y-2 text-slate-600 dark:text-slate-400">
            <li>Determine the total number of frames: 240 frames.</li>
            <li>Measure or estimate the seconds per frame on a single node: 45 seconds/frame.</li>
            <li>Input the number of nodes available: 8 nodes.</li>
            <li>Calculate total render time: (240 frames * 45 sec/frame) / 8 nodes = 1350 seconds (22m 30s).</li>
          </ol>
          <p><strong>Result:</strong> The total estimated render time is approximately 22 minutes and 30 seconds, allowing the studio to plan their schedule accordingly.</p>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24">
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
      title="GPU Render Performance Calculator"
      description="Professional video & audio calculator: GPU Render Performance Calculator. Accurate technical formulas for production, post-production, and broadcasting."
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