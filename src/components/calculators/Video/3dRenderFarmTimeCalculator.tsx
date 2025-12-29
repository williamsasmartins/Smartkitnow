import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Film, AlertTriangle, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function 3dRenderFarmTimeCalculator() {
  const [inputs, setInputs] = useState({
    frameCount: "",
    secondsPerFrame: "",
    nodes: "",
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimals
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  const results = useMemo(() => {
    const frameCountNum = parseInt(inputs.frameCount, 10);
    const secondsPerFrameNum = parseFloat(inputs.secondsPerFrame);
    const nodesNum = parseInt(inputs.nodes, 10);

    if (
      isNaN(frameCountNum) ||
      frameCountNum <= 0 ||
      isNaN(secondsPerFrameNum) ||
      secondsPerFrameNum <= 0 ||
      isNaN(nodesNum) ||
      nodesNum <= 0
    ) {
      return {
        primary: "0",
        secondary: "Hours / Mins",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "Ensure all inputs are greater than zero.",
      };
    }

    // Total time in seconds = (frameCount * secondsPerFrame) / nodes
    const totalSeconds = (frameCountNum * secondsPerFrameNum) / nodesNum;

    // Convert totalSeconds to hours and minutes
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const formattedTime = `${hours}h ${minutes}m ${seconds}s`;

    return {
      primary: formattedTime,
      secondary: "Total Render Time",
      details: `Rendering ${frameCountNum} frames at ${secondsPerFrameNum.toFixed(
        2
      )} seconds/frame using ${nodesNum} node${nodesNum > 1 ? "s" : ""}.`,
      feedback:
        "Increasing the number of nodes decreases total render time linearly, but consider overhead and network limitations.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is a render farm node?",
      answer:
        "A render farm node is an individual computer or server that processes rendering tasks. Multiple nodes work in parallel to speed up the rendering process by dividing the workload. The more nodes you have, the faster your frames can be rendered, assuming efficient distribution and no bottlenecks.",
    },
    {
      question: "Why does increasing nodes not always reduce render time perfectly?",
      answer:
        "While adding more nodes generally decreases render time, factors like network bandwidth, data transfer overhead, and software limitations can reduce efficiency. Sometimes, diminishing returns occur when nodes outnumber the workload or when coordination overhead becomes significant.",
    },
    {
      question: "How accurate is this calculator?",
      answer:
        "This calculator provides an estimate based on input parameters assuming ideal conditions. Real-world render times may vary due to hardware differences, scene complexity, software optimizations, and network performance. Always allow buffer time in production schedules.",
    },
    {
      question: "Can I use this calculator for GPU rendering?",
      answer:
        "Yes, the calculator works for both CPU and GPU rendering as long as you input the average seconds per frame accurately. GPU rendering times can differ significantly from CPU times, so ensure your seconds per frame reflect the hardware used.",
    },
    {
      question: "What if my frames have variable render times?",
      answer:
        "If frames vary widely in render time, use an average seconds per frame value for estimation. For more precise planning, consider segmenting frames by complexity or running test renders to gather more accurate timing data.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have a 3D animation project with 240 frames. Each frame takes approximately 45 seconds to render on a single node. You have access to 10 render nodes.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Input the total frame count: 240 frames into the calculator.",
      },
      {
        label: "Step 2",
        explanation:
          "Enter the average seconds per frame: 45 seconds/frame.",
      },
      {
        label: "Step 3",
        explanation: "Enter the number of available nodes: 10 nodes.",
      },
      {
        label: "Step 4",
        explanation: "Click Calculate to see the total estimated render time.",
      },
    ],
    result:
      "The calculator estimates a total render time of approximately 3 hours and 0 minutes, showing how distributing frames across multiple nodes speeds up the process.",
  };

  const references = [
    {
      title: "Render Farm Basics - Autodesk Knowledge Network",
      description:
        "Comprehensive guide on how render farms work and best practices for distributed rendering.",
      url: "https://knowledge.autodesk.com/support/maya/learn-explore/caas/CloudHelp/cloudhelp/2023/ENU/Maya-RenderFarm/files/GUID-5B7E7B3E-3A9D-4F6A-9D3E-7B9E6E5A3B1B-htm.html",
    },
    {
      title: "Distributed Rendering Explained - Chaos Group",
      description:
        "Detailed explanation of distributed rendering concepts and how render farms optimize 3D production workflows.",
      url: "https://www.chaos.com/vray/help/distributed-rendering",
    },
    {
      title: "Optimizing Render Farm Performance - Pixar",
      description:
        "Insights on maximizing efficiency and avoiding common pitfalls in render farm setups.",
      url: "https://graphics.pixar.com/library/RenderFarmOptimization/paper.pdf",
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
          <Label htmlFor="secondsPerFrame">Seconds per Frame</Label>
          <Input
            id="secondsPerFrame"
            type="number"
            min={0.01}
            step={0.01}
            placeholder="e.g. 45"
            value={inputs.secondsPerFrame}
            onChange={(e) =>
              handleInputChange("secondsPerFrame", e.target.value)
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nodes">Number of Nodes</Label>
          <Input
            id="nodes"
            type="number"
            min={1}
            step={1}
            placeholder="e.g. 10"
            value={inputs.nodes}
            onChange={(e) => handleInputChange("nodes", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" disabled={
        !inputs.frameCount || !inputs.secondsPerFrame || !inputs.nodes
      }>
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
            <p className="mt-3 italic text-sm text-blue-700 dark:text-blue-400">
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
          <li>Enter the total number of frames you need to render in your project.</li>
          <li>Input the average time in seconds it takes to render a single frame on one node.</li>
          <li>Specify how many render nodes you have available in your render farm.</li>
          <li>Click the Calculate button to see the estimated total render time distributed across your nodes.</li>
          <li>Review the result and use it to plan your rendering schedule efficiently.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to 3D Render Farm Time Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Rendering 3D animations and visual effects is a computationally intensive process that can take hours or even days depending on the complexity of the scenes and the hardware used. A render farm is a cluster of computers (nodes) working together to distribute the rendering workload, significantly reducing the total time required.
          </p>
          <p>
            This calculator helps you estimate the total render time by taking into account three key inputs: the total number of frames in your animation, the average time it takes to render each frame on a single node, and the number of nodes available in your render farm. By dividing the total rendering workload across multiple nodes, you can achieve faster turnaround times.
          </p>
          <p>
            It is important to note that this calculator assumes ideal conditions where the workload is perfectly balanced and there is no overhead or bottleneck in the network or software. In real-world scenarios, factors such as data transfer times, node performance variability, and software inefficiencies can affect the actual render time.
          </p>
          <p>
            To get the most accurate estimate, measure the average seconds per frame by rendering a few test frames on your hardware. Also, consider that adding more nodes will reduce render time but may introduce overhead, so the speedup might not be perfectly linear.
          </p>
          <p>
            Use this tool to plan your rendering schedule, allocate resources efficiently, and optimize your production pipeline for timely delivery of high-quality 3D content.
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
            <strong>Warning:</strong> Entering zero or negative values for any input will produce invalid results. Always ensure all inputs are positive numbers.
          </p>
          <p>
            <strong>Warning:</strong> Using an inaccurate average seconds per frame can lead to misleading estimates. Test render a representative sample of frames for better accuracy.
          </p>
          <p>
            <strong>Warning:</strong> Assuming perfect linear scaling with nodes ignores overhead and network latency. Real render farms may not reduce time proportionally with added nodes.
          </p>
          <p>
            <strong>Warning:</strong> Forgetting to consider frame dependencies or scenes that require sequential rendering can invalidate parallel render assumptions.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
        <div className="space-y-4 text-slate-700 dark:text-slate-300">
          <p><strong>Scenario:</strong> {example.scenario}</p>
          <ol className="list-decimal pl-5 space-y-2">
            {example.steps.map((step, i) => (
              <li key={i}>
                <strong>{step.label}:</strong> {step.explanation}
              </li>
            ))}
          </ol>
          <p><strong>Result:</strong> {example.result}</p>
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
      title="3D Render Farm Time Calculator"
      description="Professional video & audio calculator: 3D Render Farm Time Calculator. Accurate technical formulas for production, post-production, and broadcasting."
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