import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function formatTime(seconds: number) {
  if (seconds <= 0 || !isFinite(seconds)) return "0s";
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.round(seconds % 60);
  const parts: string[] = [];
  if (hrs) parts.push(`${hrs}h`);
  if (mins) parts.push(`${mins}m`);
  if (secs || parts.length === 0) parts.push(`${secs}s`);
  return parts.join(" ");
}

export default function MultiWorkstationRenderTimeCalculator() {
  const [inputs, setInputs] = useState({
    frameCount: "",
    secPerFrame: "",
    nodes: "",
  });

  const handleInputChange = (field: string, value: string) => {
    // Only allow numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  const results = useMemo(() => {
    const frameCount = parseFloat(inputs.frameCount);
    const secPerFrame = parseFloat(inputs.secPerFrame);
    const nodes = parseInt(inputs.nodes);

    if (
      isNaN(frameCount) ||
      isNaN(secPerFrame) ||
      isNaN(nodes) ||
      frameCount <= 0 ||
      secPerFrame <= 0 ||
      nodes <= 0
    ) {
      return {
        primary: "—",
        secondary: "",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "",
      };
    }

    // Total render time in seconds without nodes
    const totalSeconds = frameCount * secPerFrame;

    // Divide by nodes for parallel rendering
    const totalSecondsDistributed = totalSeconds / nodes;

    // Format output
    const formattedTime = formatTime(totalSecondsDistributed);

    return {
      primary: formattedTime,
      secondary: "Total Render Time (Distributed)",
      details: `Rendering ${frameCount.toLocaleString()} frames at ${secPerFrame.toFixed(
        2
      )} seconds per frame across ${nodes.toLocaleString()} workstation${
        nodes > 1 ? "s" : ""
      }.`,
      feedback:
        nodes > 1
          ? "Adding more nodes reduces render time linearly, but consider network and overhead delays in real setups."
          : "Single node render time; consider adding more nodes to speed up rendering.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How does adding more workstations affect render time?",
      answer:
        "Adding more workstations (nodes) divides the total rendering workload, effectively reducing the total render time. However, the speedup is ideally linear only if the workload is perfectly divisible and there is no overhead. In real-world scenarios, network latency, data transfer, and synchronization can add overhead, slightly reducing efficiency gains.",
    },
    {
      question: "What is 'seconds per frame' in rendering?",
      answer:
        "'Seconds per frame' refers to the average time it takes to render a single frame of your video or animation. This depends on the complexity of the scene, resolution, effects, and hardware performance. Accurately estimating this value is crucial for predicting total render times.",
    },
    {
      question: "Can I use this calculator for GPU and CPU rendering combined?",
      answer:
        "Yes, but you should use an average 'seconds per frame' value that reflects the combined performance of your rendering setup. If you have heterogeneous nodes (some GPU, some CPU), consider benchmarking each separately and calculating a weighted average for more accurate results.",
    },
    {
      question: "Does this calculator account for overhead or network delays?",
      answer:
        "No, this calculator assumes ideal conditions with zero overhead. In practice, network transfer times, job dispatch overhead, and other factors can increase total render time. Always add a buffer to your estimates to accommodate these real-world delays.",
    },
    {
      question: "How can I improve render times besides adding more nodes?",
      answer:
        "Optimizing your scene by reducing complexity, using proxies, lowering resolution for previews, and upgrading hardware can all improve render times. Efficiently managing render farms and using render queue optimizations also help maximize throughput.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have a 10,000-frame animation, each frame taking 12 seconds to render on average. You want to use 5 workstations to speed up the process.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Input the total frame count: 10,000 frames into the calculator.",
      },
      {
        label: "Step 2",
        explanation:
          "Enter the average seconds per frame: 12 seconds/frame.",
      },
      {
        label: "Step 3",
        explanation:
          "Enter the number of rendering nodes (workstations): 5.",
      },
      {
        label: "Step 4",
        explanation:
          "Calculate to find the total distributed render time.",
      },
    ],
    result:
      "The calculator shows approximately 6 hours and 40 minutes total render time when distributed across 5 workstations, significantly reducing the time compared to a single workstation.",
  };

  const references = [
    {
      title: "Render Farm Basics - Autodesk",
      description:
        "Comprehensive guide on how render farms work and how to optimize rendering workflows.",
      url: "https://knowledge.autodesk.com/support/maya/learn-explore/caas/CloudHelp/cloudhelp/2023/ENU/Maya-RenderFarm/files/GUID-7B5A7E3B-7C7B-4E9F-8D7B-3F6B7F7A7F7A-htm.html",
    },
    {
      title: "Parallel Rendering Techniques",
      description:
        "An in-depth article on parallel rendering and how distributing workloads can improve render times.",
      url: "https://www.fxguide.com/fxfeatured/parallel-rendering/",
    },
    {
      title: "Estimating Render Times",
      description:
        "Tips and methods to accurately estimate render times for complex projects.",
      url: "https://www.pugetsystems.com/labs/articles/Estimating-Render-Times-For-3D-Projects-1560/",
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
            min={0.01}
            step={0.01}
            placeholder="e.g. 12.5"
            value={inputs.secPerFrame}
            onChange={(e) => handleInputChange("secPerFrame", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nodes">Number of Workstations (Nodes)</Label>
          <Input
            id="nodes"
            type="number"
            min={1}
            step={1}
            placeholder="e.g. 5"
            value={inputs.nodes}
            onChange={(e) => handleInputChange("nodes", e.target.value)}
          />
        </div>
      </div>

      <Separator />

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
            <p className="mt-3 italic text-sm text-blue-700">{results.feedback}</p>
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
          <li>Enter the total number of frames you need to render in the "Frame Count" field.</li>
          <li>Input the average time it takes to render one frame in seconds in the "Seconds per Frame" field.</li>
          <li>Specify the number of workstations (nodes) you will use for rendering in the "Number of Workstations" field.</li>
          <li>Click the "Calculate" button to see the estimated total render time distributed across your workstations.</li>
          <li>Review the result and use the feedback to optimize your rendering workflow.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Multi-Workstation Render Time Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Rendering large video projects or animations can be a time-consuming process, especially when working with high-resolution footage, complex effects, or detailed 3D scenes. To manage deadlines effectively and optimize your workflow, understanding how long your render will take is crucial. The Multi-Workstation Render Time Calculator helps you estimate the total render time when distributing the workload across multiple workstations or nodes.
          </p>
          <p>
            The calculator requires three key inputs: the total number of frames to render, the average time it takes to render each frame, and the number of workstations available for rendering. By multiplying the frame count by the seconds per frame, you get the total render time if using a single workstation. Dividing this total by the number of nodes gives an ideal estimate of how much time the render will take when distributed.
          </p>
          <p>
            It’s important to note that this calculator assumes ideal conditions without accounting for overhead such as network latency, data transfer times, or job scheduling delays. In real-world scenarios, these factors can add to the total render time, so it’s wise to add a buffer to your estimates. Additionally, the efficiency gain from adding more nodes may diminish if the workload is not perfectly divisible or if nodes have different performance capabilities.
          </p>
          <p>
            Using this calculator allows video engineers, post-production supervisors, and DITs to plan render schedules more accurately, allocate resources efficiently, and communicate realistic timelines to clients and teams. It also helps identify bottlenecks and evaluate whether investing in additional hardware will provide a worthwhile return in time savings.
          </p>
          <p>
            Remember, accurate input values are essential for reliable estimates. Benchmark your rendering times on representative frames and consider the complexity of your project when using this tool. With careful planning and resource management, you can significantly reduce render times and improve your production workflow.
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
            <strong>Warning:</strong> Entering zero or negative values for any input will produce invalid results. Always use positive numbers.
          </p>
          <p>
            <strong>Warning:</strong> Assuming perfect linear scaling with nodes can lead to underestimating render times. Network overhead and node performance differences affect actual speedup.
          </p>
          <p>
            <strong>Warning:</strong> Using an inaccurate average seconds per frame value, such as from a non-representative frame, will skew your total time estimate.
          </p>
          <p>
            <strong>Warning:</strong> Forgetting to include all nodes in the count or mixing different hardware types without adjustment can cause misleading results.
          </p>
          <p>
            <strong>Warning:</strong> Ignoring render queue overhead, scene loading times, and other non-rendering tasks can cause actual render times to be longer than calculated.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="space-y-4 text-slate-700 dark:text-slate-300">
          <p>
            <strong>Scenario:</strong> You have a 10,000-frame animation, each frame taking 12 seconds to render on average. You want to use 5 workstations to speed up the process.
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Input the total frame count: 10,000 frames into the calculator.</li>
            <li>Enter the average seconds per frame: 12 seconds/frame.</li>
            <li>Enter the number of rendering nodes (workstations): 5.</li>
            <li>Calculate to find the total distributed render time.</li>
          </ol>
          <p>
            <strong>Result:</strong> The calculator shows approximately 6 hours and 40 minutes total render time when distributed across 5 workstations, significantly reducing the time compared to a single workstation.
          </p>
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
      title="Multi-Workstation Render Time Calculator"
      description="Professional video & audio calculator: Multi-Workstation Render Time Calculator. Accurate technical formulas for production, post-production, and broadcasting."
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
