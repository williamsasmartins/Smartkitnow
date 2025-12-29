import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Film, AlertTriangle, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function 3dRenderTimeCalculator() {
  const [inputs, setInputs] = useState({
    frameCount: "",
    secPerFrame: "",
    nodes: "",
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimals
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  const results = useMemo(() => {
    const frameCount = parseFloat(inputs.frameCount);
    const secPerFrame = parseFloat(inputs.secPerFrame);
    const nodes = parseFloat(inputs.nodes);

    if (
      isNaN(frameCount) ||
      isNaN(secPerFrame) ||
      isNaN(nodes) ||
      frameCount <= 0 ||
      secPerFrame <= 0 ||
      nodes <= 0
    ) {
      return null;
    }

    // Total time in seconds = (frameCount * secPerFrame) / nodes
    const totalSeconds = (frameCount * secPerFrame) / nodes;

    // Convert totalSeconds to hours, minutes, seconds
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.round(totalSeconds % 60);

    // Format result string
    const timeParts = [];
    if (hours > 0) timeParts.push(`${hours}h`);
    if (minutes > 0) timeParts.push(`${minutes}m`);
    timeParts.push(`${seconds}s`);

    const primary = timeParts.join(" ");

    const details = `Calculation: (${frameCount} frames × ${secPerFrame} sec/frame) ÷ ${nodes} node${nodes > 1 ? "s" : ""} = ${totalSeconds.toFixed(
      2
    )} seconds total.`;

    const feedback =
      nodes > 1
        ? "Using multiple nodes reduces render time proportionally."
        : "Consider adding more render nodes to speed up the process.";

    return {
      primary,
      secondary: "Total Render Time",
      details,
      feedback,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is a render node?",
      answer:
        "A render node is a computer or server that processes frames in a 3D rendering job. Multiple nodes can work in parallel to reduce total render time by distributing the workload.",
    },
    {
      question: "Why does increasing nodes reduce render time?",
      answer:
        "Increasing the number of nodes allows frames to be rendered simultaneously rather than sequentially. This parallel processing divides the total workload, significantly decreasing the overall render duration.",
    },
    {
      question: "Can render time be exactly divided by nodes?",
      answer:
        "In ideal conditions, yes, but in practice, overheads such as network latency, node setup time, and uneven frame complexity can cause render times to deviate slightly from perfect division.",
    },
    {
      question: "What factors affect seconds per frame?",
      answer:
        "Seconds per frame depend on scene complexity, rendering settings, hardware performance, and software optimizations. Higher quality settings and complex scenes increase seconds per frame.",
    },
    {
      question: "How can I optimize my render times?",
      answer:
        "Optimizing render times involves balancing scene complexity, using efficient render settings, leveraging multiple nodes, and upgrading hardware. Profiling renders to identify bottlenecks also helps improve efficiency.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "A studio needs to render a 240-frame animation. Each frame takes 45 seconds to render on one node. They have 4 render nodes available.",
    steps: [
      {
        label: "Step 1",
        explanation: "Input total frame count: 240 frames.",
      },
      {
        label: "Step 2",
        explanation: "Input seconds per frame: 45 seconds.",
      },
      {
        label: "Step 3",
        explanation: "Input number of render nodes: 4 nodes.",
      },
      {
        label: "Step 4",
        explanation:
          "Calculate total render time: (240 × 45) ÷ 4 = 2700 seconds = 45 minutes.",
      },
    ],
    result: "The total render time is 45 minutes using 4 nodes.",
  };

  const references = [
    {
      title: "Understanding Render Farms",
      description:
        "An in-depth guide on how render farms work and how they speed up 3D rendering.",
      url: "https://www.autodesk.com/redshift/what-is-a-render-farm/",
    },
    {
      title: "Optimizing Render Times in 3D Software",
      description:
        "Tips and tricks for reducing render times by optimizing scenes and settings.",
      url: "https://www.sidefx.com/docs/houdini/render/optimize.html",
    },
    {
      title: "Parallel Rendering Explained",
      description:
        "Technical overview of parallel rendering and its benefits in production pipelines.",
      url: "https://www.fxguide.com/fxfeatured/parallel_rendering/",
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
            min="0.01"
            step="0.01"
            placeholder="e.g. 45"
            value={inputs.secPerFrame}
            onChange={(e) => handleInputChange("secPerFrame", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nodes">Number of Render Nodes</Label>
          <Input
            id="nodes"
            type="number"
            min="1"
            step="1"
            placeholder="e.g. 4"
            value={inputs.nodes}
            onChange={(e) => handleInputChange("nodes", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" disabled={!results}>
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
          <li>Enter the total number of frames you need to render in the "Frame Count" field.</li>
          <li>Input the average time it takes to render one frame in seconds in the "Seconds per Frame" field.</li>
          <li>Specify how many render nodes (computers/servers) you have available for rendering.</li>
          <li>Click the "Calculate" button to see the estimated total render time distributed across your nodes.</li>
          <li>Review the result displayed in hours, minutes, and seconds along with calculation details and optimization tips.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to 3D Render Time Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Rendering 3D animations and scenes is a computationally intensive process that can take a significant amount of time depending on the complexity of the project and the hardware used. The 3D Render Time Calculator helps professionals estimate how long a rendering job will take by considering three key factors: the total number of frames, the average seconds required to render each frame, and the number of render nodes available.
          </p>
          <p>
            The total render time is calculated by multiplying the frame count by the seconds per frame, then dividing by the number of nodes. This formula assumes that the workload is evenly distributed across all nodes, which is typical in render farms or distributed rendering setups. By understanding this calculation, studios and artists can better plan their schedules, allocate resources efficiently, and optimize their rendering pipelines.
          </p>
          <p>
            It is important to note that while adding more render nodes generally decreases render time, there are diminishing returns due to overheads such as network communication and scene loading times. Additionally, the seconds per frame can vary based on scene complexity, lighting, effects, and render settings. This calculator provides an estimate to guide planning but actual render times may vary.
          </p>
          <p>
            Using this calculator can help avoid costly delays in production by providing realistic expectations and encouraging optimization strategies such as reducing scene complexity, tweaking render settings, or investing in additional hardware. It is a valuable tool for anyone involved in 3D production, from independent artists to large studios.
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
            <strong>Warning:</strong> Entering zero or negative values for frame count, seconds per frame, or nodes will produce invalid results. Always ensure inputs are positive numbers.
          </p>
          <p>
            <strong>Warning:</strong> Assuming perfect linear scaling with nodes can be misleading. Network overhead and uneven frame complexity can cause render times to be longer than calculated.
          </p>
          <p>
            <strong>Warning:</strong> Using an average seconds per frame that does not reflect the actual scene complexity can result in inaccurate estimates. Measure or profile your renders for better accuracy.
          </p>
          <p>
            <strong>Warning:</strong> Forgetting to update the number of nodes when hardware changes can lead to planning errors. Always keep your node count current.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="space-y-4">
          <p>
            <strong>Scenario:</strong> A studio needs to render a 240-frame animation. Each frame takes 45 seconds to render on one node. They have 4 render nodes available.
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-slate-600 dark:text-slate-400">
            <li>Input total frame count: 240 frames.</li>
            <li>Input seconds per frame: 45 seconds.</li>
            <li>Input number of render nodes: 4 nodes.</li>
            <li>Calculate total render time: (240 × 45) ÷ 4 = 2700 seconds = 45 minutes.</li>
          </ol>
          <p>
            <strong>Result:</strong> The total render time is 45 minutes using 4 nodes.
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
      title="3D Render Time Calculator"
      description="Professional video & audio calculator: 3D Render Time Calculator. Accurate technical formulas for production, post-production, and broadcasting."
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