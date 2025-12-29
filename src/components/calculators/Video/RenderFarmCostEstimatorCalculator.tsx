import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Film, AlertTriangle, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function RenderFarmCostEstimatorCalculator() {
  const [inputs, setInputs] = useState({
    frameCount: "",
    secPerFrame: "",
    nodes: "",
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimal point
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
      isNaN(secPerFrame) ||
      isNaN(nodes) ||
      frameCount <= 0 ||
      secPerFrame <= 0 ||
      nodes <= 0
    ) {
      return {
        primary: "0",
        secondary: "Hours / Mins",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "Ensure all inputs are greater than zero.",
      };
    }

    // Total time in seconds = (frameCount * secPerFrame) / nodes
    const totalSeconds = (frameCount * secPerFrame) / nodes;

    // Convert totalSeconds to hours and minutes
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    // Format time string
    let timeStr = "";
    if (hours > 0) timeStr += `${hours}h `;
    if (minutes > 0) timeStr += `${minutes}m `;
    timeStr += `${seconds}s`;

    return {
      primary: timeStr.trim(),
      secondary: "Total Render Time",
      details: `Rendering ${frameCount.toLocaleString()} frames at ${secPerFrame} seconds/frame using ${nodes.toLocaleString()} node${nodes > 1 ? "s" : ""}.`,
      feedback:
        "Increasing the number of nodes reduces total render time linearly, but consider cost and network overhead.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is a render farm?",
      answer:
        "A render farm is a cluster of networked computers (nodes) used to render computer-generated imagery (CGI), animations, and visual effects. It distributes rendering tasks across multiple machines to speed up the process significantly compared to a single computer.",
    },
    {
      question: "How does the number of nodes affect render time?",
      answer:
        "The number of nodes directly impacts the total render time. More nodes mean the workload is divided among more machines, reducing the time it takes to complete rendering. However, diminishing returns may occur due to overhead and network latency.",
    },
    {
      question: "What does 'seconds per frame' mean?",
      answer:
        "'Seconds per frame' is the average time it takes to render a single frame on one node. This depends on the complexity of the scene, resolution, rendering settings, and hardware capabilities.",
    },
    {
      question: "Can I use this calculator for GPU and CPU render farms?",
      answer:
        "Yes, this calculator works for both GPU and CPU render farms as long as you know the average seconds per frame for your hardware. Different hardware types will have different performance metrics, so input accurate values for best estimates.",
    },
    {
      question: "Does this calculator include cost estimation?",
      answer:
        "This calculator estimates total render time only. To estimate cost, you would need to multiply the total render time by your render farm's hourly rate per node or overall pricing model.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have a 10,000 frame animation that takes 45 seconds to render each frame on a single node. You want to use 20 nodes in your render farm to speed up the process.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Enter 10,000 as the Frame Count (total frames to render).",
      },
      {
        label: "Step 2",
        explanation:
          "Enter 45 as Seconds per Frame (average time to render one frame).",
      },
      {
        label: "Step 3",
        explanation:
          "Enter 20 as Nodes (number of machines rendering in parallel).",
      },
      {
        label: "Step 4",
        explanation: "Click Calculate to see the total render time.",
      },
    ],
    result:
      "The calculator shows approximately 6 hours 15 minutes total render time, significantly faster than rendering on a single node.",
  };

  const references = [
    {
      title: "Render Farm Wikipedia",
      description:
        "Comprehensive overview of render farms, their architecture, and usage in CGI and animation.",
      url: "https://en.wikipedia.org/wiki/Render_farm",
    },
    {
      title: "Pixar RenderMan Documentation",
      description:
        "Industry standard rendering software documentation with insights on render farm setups.",
      url: "https://renderman.pixar.com/resources/RenderMan_20_White_Paper.pdf",
    },
    {
      title: "AWS Thinkbox Deadline Render Farm",
      description:
        "Cloud-based render farm solution with pricing and performance details.",
      url: "https://aws.amazon.com/thinkbox/deadline/",
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
            placeholder="e.g. 45"
            value={inputs.secPerFrame}
            onChange={(e) => handleInputChange("secPerFrame", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nodes">Nodes</Label>
          <Input
            id="nodes"
            type="number"
            min={1}
            step={1}
            placeholder="e.g. 20"
            value={inputs.nodes}
            onChange={(e) => handleInputChange("nodes", e.target.value)}
          />
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
          <li>
            Input the average time it takes to render one frame (in seconds) in the "Seconds per Frame" field.
          </li>
          <li>Specify the number of nodes (computers) available in your render farm.</li>
          <li>Click the "Calculate" button to compute the total render time distributed across your nodes.</li>
          <li>
            Review the result displayed below, which shows the estimated total render time in hours, minutes, and seconds.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Render Farm Cost Estimator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Rendering is a critical step in video production, animation, and visual effects workflows. It involves generating final images or frames from 3D models, scenes, and animations using complex calculations. Because rendering can be computationally intensive and time-consuming, professionals often use render farms—clusters of multiple computers working in parallel—to speed up the process.
          </p>
          <p>
            This calculator helps you estimate the total time required to render a sequence of frames using a render farm. By inputting the total number of frames, the average time it takes to render each frame on a single node, and the number of nodes available, you get an estimate of how long the entire render job will take when distributed across your farm.
          </p>
          <p>
            The calculation assumes that the workload is evenly distributed and that all nodes work simultaneously without overhead or downtime. In reality, factors like network latency, node performance variability, and task overhead can affect total render time. However, this tool provides a solid baseline estimate for planning and budgeting.
          </p>
          <p>
            Understanding render times is essential for scheduling production timelines, managing costs, and optimizing resource allocation. For example, increasing the number of nodes reduces render time but may increase operational costs. Balancing speed and cost efficiency is key to effective render farm management.
          </p>
          <p>
            Use this calculator to quickly assess how changes in frame count, frame complexity (seconds per frame), or node count impact your render schedules. It is a valuable tool for video engineers, DITs, post-production supervisors, and anyone involved in managing rendering workflows.
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
            <strong>Warning:</strong> One common mistake is entering zero or negative values for any input, which leads to invalid or misleading results. Always ensure all inputs are positive numbers.
          </p>
          <p>
            Another frequent error is underestimating the seconds per frame. This value should be based on real benchmarks or tests on your hardware to avoid unrealistic render time estimates.
          </p>
          <p>
            Users sometimes forget that adding more nodes does not always linearly decrease render time due to overhead, network bottlenecks, or software limitations. Use this calculator as an estimate, not an exact prediction.
          </p>
          <p>
            Lastly, this calculator does not factor in cost directly. To estimate cost, multiply the total render time by your render farm's hourly rate per node.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="space-y-4 text-slate-700 dark:text-slate-300">
          <p>
            <strong>Scenario:</strong> You have a 10,000 frame animation that takes 45 seconds to render each frame on a single node. You want to use 20 nodes in your render farm to speed up the process.
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Enter 10,000 as the Frame Count.</li>
            <li>Enter 45 as Seconds per Frame.</li>
            <li>Enter 20 as Nodes.</li>
            <li>Click Calculate.</li>
          </ol>
          <p>
            <strong>Result:</strong> The calculator shows approximately 6 hours 15 minutes total render time, significantly faster than rendering on a single node, which would take over 125 hours.
          </p>
        </div>
      </section>

      <section id="faq">
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
      title="Render Farm Cost Estimator"
      description="Professional video & audio calculator: Render Farm Cost Estimator. Accurate technical formulas for production, post-production, and broadcasting."
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